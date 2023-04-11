import { useClassNames } from '../..';
import { css } from '../../styles';
import {
  computed,
  DefineComponent,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watchEffect,
} from 'vue';
import { failTextClassName, setTestTheme } from './style';
import { Header } from './Header';
import { Loading } from '../../common/Loading';
import { RunButton } from './RunButton';
import { SandpackStack } from '../../common';
import { Specs } from './Specs';
import { Summary } from './Summary';
import { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { useSandpackClient, useSandpackTheme } from '../../hooks';
import type { Spec } from './Specs';
import type { Test } from './Tests';
import {
  flatMap,
  getDuration,
  getAllTestResults,
  getAllSuiteResults,
  splitTail,
  set,
} from './utils';

const previewActionsClassName = css({
  display: 'flex',
  position: 'absolute',
  bottom: '$space$2',
  right: '$space$2',
  zIndex: '$overlay',

  '> *': { marginLeft: '$space$2' },
});

export type Status = 'initialising' | 'idle' | 'running' | 'complete';

interface State {
  specs: Record<string, Spec>;
  status: Status;
  verbose: boolean;
  watchMode: boolean;
  suiteOnly: boolean;
  specsCount: number;
}

const INITIAL_STATE: State = {
  specs: {},
  status: 'initialising',
  verbose: false,
  watchMode: true,
  suiteOnly: false,
  specsCount: 0,
};

interface Props {
  verbose?: boolean;
  watchMode?: boolean;
  onComplete?: (specs: Record<string, Spec>) => void;
  actionsChildren?: JSX.Element;
  showVerboseButton?: boolean;
  showWatchButton?: boolean;
  /**
   * Hide the tests and supress logs
   * If `true` the tests will be hidden and the logs will be supressed.
   * This is useful when you want to run tests in the background and don't want to show the tests to the user.
   * @default false
   */
  hideTestsAndSupressLogs?: boolean;
  standalone?: boolean;
}

export const SandpackTests = defineComponent({
  name: 'SandpackTests',
  props: {
    verbose: {
      type: Boolean,
      required: false,
      default: false,
    },
    watchMode: {
      type: Boolean,
      required: false,
      default: true,
    },
    onComplete: {
      type: Function as PropType<(specs: Record<string, Spec>) => void>,
      required: false,
      default: undefined,
    },
    actionsChildren: {
      type: Object as PropType<JSX.Element>,
      required: false,
      default: null,
    },
    showVerboseButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showWatchButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    hideTestsAndSupressLogs: {
      type: Boolean,
      required: false,
      default: false,
    },
    standalone: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props: Props, { slots, attrs }) {
    let unsunscribe: UnsubscribeFunction;
    let unsubscribe: UnsubscribeFunction;
    const testFileRegex = /.*\.(test|spec)\.[tj]sx?$/;

    const theme = useSandpackTheme();
    const { getClient, iframe, listen, sandpack } = useSandpackClient();
    const classNames = useClassNames();

    const state = ref<State>({
      ...INITIAL_STATE,
      verbose: props.verbose || false,
      watchMode: props.watchMode || true,
    } as State);

    const runAllTests = () => {
      state.value.status = 'running';
      state.value.specs = {};

      const client = getClient();
      if (client) {
        client.dispatch({ type: 'run-all-tests' });
      }
    };

    const runSpec = () => {
      state.value = {
        ...state.value,
        status: 'running',
        specs: {},
      };

      const client = getClient();
      if (client) {
        client.dispatch({ type: 'run-tests', path: sandpack.activeFile });
      }
    };

    const isSpecOpen = computed(() => sandpack.activeFile.match(testFileRegex) !== null);

    const subscribeIFrameData = () => {
      let currentDescribeBlocks: string[] = [];
      let currentSpec = '';

      if (unsubscribe) unsubscribe();
      unsubscribe = listen((data) => {
        // Note: short-circuit if message isn't for the currently active spec when `suiteOnly` is true
        if (
          state.value.suiteOnly &&
          (('path' in data && data.path !== sandpack.activeFile) ||
            ('test' in data &&
              'path' in data.test &&
              data.test.path !== sandpack.activeFile))
        ) {
          return;
        }

        if (
          data.type === 'action' &&
          data.action === 'clear-errors' &&
          data.source === 'jest'
        ) {
          currentSpec = data.path;
          return;
        }

        if (data.type === 'test') {
          if (data.event === 'initialize_tests') {
            currentDescribeBlocks = [];
            currentSpec = '';
            if (state.value.watchMode) {
              return runAllTests();
            } else {
              state.value = {
                ...state.value,
                status: 'idle',
                specs: {},
              };
              return;
            }
          }

          if (data.event === 'test_count') {
            state.value = {
              ...state.value,
              specsCount: data.count,
            };
            return;
          }

          if (data.event === 'total_test_start') {
            currentDescribeBlocks = [];
            state.value = {
              ...state.value,
              status: 'running',
            };
            return;
          }

          if (data.event === 'total_test_end') {
            if (props.onComplete !== undefined) {
              props.onComplete(state.value.specs);
            }
            state.value = {
              ...state.value,
              status: 'complete',
            };

            return;
          }

          if (data.event === 'add_file') {
            state.value = set(state.value, ['specs', data.path], {
              describes: {},
              tests: {},
              name: data.path,
            });
            return;
          }

          if (data.event === 'remove_file') {
            const specs = Object.entries(state.value.specs).reduce(
              (acc, [key, value]) => {
                if (key === data.path) {
                  return acc;
                } else {
                  return { ...acc, [key]: value };
                }
              },
              {},
            );

            state.value = { ...state.value, specs };
            return;
          }

          if (data.event === 'file_error') {
            state.value = set(state.value, ['specs', data.path, 'error'], data.error);
            return;
          }

          if (data.event === 'describe_start') {
            currentDescribeBlocks.push(data.blockName);
            const [describePath, currentDescribe] = splitTail(
              currentDescribeBlocks,
            );
            const spec = currentSpec;

            if (currentDescribe === undefined) {
              return;
            }

            state.value = set(
              state.value,
              [
                'specs',
                spec,
                'describes',
                ...flatMap(describePath, (name) => [name, 'describes']),
                currentDescribe,
              ],
              {
                name: data.blockName,
                tests: {},
                describes: {},
              },
            );
            return;
          }

          if (data.event === 'describe_end') {
            currentDescribeBlocks.pop();
            return;
          }

          if (data.event === 'add_test') {
            const [describePath, currentDescribe] = splitTail(
              currentDescribeBlocks,
            );
            const test: Test = {
              status: 'idle',
              errors: [],
              name: data.testName,
              blocks: [...currentDescribeBlocks],
              path: data.path,
            };
            if (currentDescribe === undefined) {
              state.value = set(
                state.value,
                ['specs', data.path, 'tests', data.testName],
                test,
              );
              return;
            } else {
              state.value = set(
                state.value,
                [
                  'specs',
                  data.path,
                  'describes',
                  ...flatMap(describePath, (name) => [name, 'describes']),
                  currentDescribe,
                  'tests',
                  data.testName,
                ],
                test,
              );
              return;
            }
          }

          if (data.event === 'test_start') {
            const { test } = data;
            const [describePath, currentDescribe] = splitTail(test.blocks);

            const startedTest: Test = {
              status: 'running',
              name: test.name,
              blocks: test.blocks,
              path: test.path,
              errors: [],
            };

            if (currentDescribe === undefined) {
              state.value = set(
                state.value,
                ['specs', test.path, 'tests', test.name],
                startedTest,
              );
              return;
            } else {
              state.value = set(
                state.value,
                [
                  'specs',
                  test.path,
                  'describes',
                  ...flatMap(describePath, (name) => [name, 'describes']),
                  currentDescribe,
                  'tests',
                  test.name,
                ],
                startedTest,
              );
              return;
            }
          }

          if (data.event === 'test_end') {
            const { test } = data;
            const [describePath, currentDescribe] = splitTail(test.blocks);
            const endedTest = {
              status: test.status,
              errors: test.errors,
              duration: test.duration,
              name: test.name,
              blocks: test.blocks,
              path: test.path,
            };

            if (currentDescribe === undefined) {
              state.value = set(
                state.value,
                ['specs', test.path, 'tests', test.name],
                endedTest,
              );
            } else {
              state.value = set(
                state.value,
                [
                  'specs',
                  test.path,
                  'describes',
                  ...flatMap(describePath, (name) => [name, 'describes']),
                  currentDescribe,
                  'tests',
                  test.name,
                ],
                endedTest,
              );
            }
          }
        }
      });
    };

    const listenIframeAction = () => {
      if (unsunscribe) unsunscribe();

      unsunscribe = listen(({ type }) => {
        if (type === 'done' && state.value.watchMode) {
          if (isSpecOpen.value) {
            runSpec();
          } else {
            runAllTests();
          }
        }
      });
    };

    watchEffect(listenIframeAction);
    watchEffect(subscribeIFrameData);

    onMounted(listenIframeAction);

    onBeforeUnmount(() => {
      if (unsunscribe) unsunscribe();
      if (unsubscribe) unsubscribe();
    });

    onUnmounted(() => {
      if (unsunscribe) unsunscribe();
      if (unsubscribe) unsubscribe();
    });

    const openSpec = (file: string): void => {
      sandpack.setActiveFile(file);
    };

    const specs = computed(() => Object.values(state.value.specs));
    const duration = computed(() => getDuration(specs.value));
    const testResults = computed(() => getAllTestResults(specs.value));
    const suiteResults = computed(() => getAllSuiteResults(specs.value));

    return () => (
      <SandpackStack
        {...props}
        class={classNames('tests', [attrs?.class || ''])}
        style={{
          ...setTestTheme(theme.mode === 'dark'),
          ...(attrs?.style || {}) as object,
        }}
      >
        <iframe ref={iframe} style={{ display: 'none' }} title="Sandpack Tests" />

        <Header
          hideTestsAndSupressLogs={props.hideTestsAndSupressLogs as boolean}
          showVerboseButton={props.showVerboseButton as boolean}
          showWatchButton={props.showWatchButton as boolean}
          setSuiteOnly={() => { state.value.suiteOnly = !state.value.suiteOnly; }}
          setVerbose={() => { state.value = { ...state.value, verbose: !state.value.verbose }; }}
          setWatchMode={() => { state.value = { ...state.value, watchMode: !state.value.watchMode }; }}
          showSuitesOnly={state.value.specsCount > 1}
          status={state.value.status}
          suiteOnly={state.value.suiteOnly}
          verbose={state.value.verbose}
          watchMode={state.value.watchMode}
        />

        {
          state.value.status === 'running' || state.value.status === 'initialising' ? (
            <Loading showOpenInCodeSandbox={false} />
          ) : (
            <div class={previewActionsClassName.toString()}>
              {
                slots.actionsChildren
                  ? slots.actionsChildren()
                  : props.actionsChildren ? props.actionsChildren : null
              }
              <RunButton
                onClick={() => {
                  if (state.value.suiteOnly) {
                    runSpec();
                  } else {
                    runAllTests();
                  }
                }}
              />
            </div>
          )
        }

        <div class={containerClassName.toString()}>
          {specs.value.length === 0 && state.value.status === 'complete' ? (
            <div class={fileErrorContainerClassName.toString()}>
              <p>No test files found.</p>
              <p>
                Test match:{' '}
                <span class={failTextClassName.toString()}>
                  {testFileRegex.toString()}
                </span>
              </p>
            </div>
          ) : (
            <>
              <Specs
                openSpec={openSpec}
                specs={specs.value}
                status={state.value.status}
                verbose={state.value.verbose}
                hideTestsAndSupressLogs={props.hideTestsAndSupressLogs}
              />

              {state.value.status === 'complete' && testResults.value.total > 0 && (
                <Summary
                  duration={duration.value}
                  suites={suiteResults.value}
                  tests={testResults.value}
                />
              )}
            </>
          )}
        </div>
      </SandpackStack>
    );
  },
}) as DefineComponent<Props>;

const containerClassName = css({
  padding: '$space$4',
  height: '100%',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  fontFamily: '$font$mono',
});

const fileErrorContainerClassName = css({
  fontWeight: 'bold',
  color: '$colors$base',
});
