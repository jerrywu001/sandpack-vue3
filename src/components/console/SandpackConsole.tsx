import { useClassNames, useSandpack, useSandpackClient, useSandpackShell } from '../..';
import { CleanIcon, RestartIcon } from '../../icons';
import { ConsoleList } from './ConsoleList';
import { css, THEME_PREFIX } from '../../styles';
import { Header } from './Header';
import { RoundedButton } from '../../common/RoundedButton';
import { SandpackConsoleData } from './utils/getType';
import { DependenciesProgress, SandpackStack } from '../../common';
import { StdoutList } from './StdoutList';
import { useSandpackConsole } from './useSandpackConsole';
import { useSandpackShellStdout } from '../../hooks/useSandpackShellStdout';
import {
  computed,
  defineComponent,
  DefineComponent,
  nextTick,
  PropType,
  ref,
  toRaw,
  watch,
} from 'vue';

interface SandpackConsoleProps {
  clientId?: string;
  showHeader?: boolean;
  showSyntaxError?: boolean;
  showSetupProgress?: boolean;
  showRestartButton?: boolean;
  showResetConsoleButton?: boolean;
  maxMessageCount?: number;
  onLogsChange?: (logs: SandpackConsoleData) => void;
  /** Reset the console list on every preview restart */
  resetOnPreviewRestart?: boolean;
  standalone?: boolean;
  actionsChildren?: JSX.Element;
}

/**
 * `SandpackConsole` is a Sandpack devtool that allows printing
 * the console logs from a Sandpack client. It is designed to be
 * a light version of a browser console, which means that it's
 * limited to a set of common use cases you may encounter when coding.
 */
export const SandpackConsole = defineComponent({
  name: 'SandpackConsole',
  props: {
    onLogsChange: {
      type: Function as PropType<(logs: SandpackConsoleData) => void>,
      required: false,
      default: undefined,
    },
    showSetupProgress: {
      type: Boolean,
      required: false,
      default: false,
    },
    showRestartButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showResetConsoleButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    resetOnPreviewRestart: {
      type: Boolean,
      required: false,
      default: false,
    },
    showHeader: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSyntaxError: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxMessageCount: {
      type: Number,
      required: false,
      default: undefined,
    },
    standalone: {
      type: Boolean,
      required: false,
      default: false,
    },
    actionsChildren: {
      type: Object as PropType<JSX.Element>,
      required: false,
      default: null,
    },
  },
  setup(props: SandpackConsoleProps & { reset?: () => void }, { slots, attrs, expose }) {
    const {
      sandpack: { environment },
    } = useSandpack();

    const wrapperRef = ref<HTMLDivElement>();
    const { iframe, clientId: internalClientId } = useSandpackClient();
    const { restart } = useSandpackShell();
    const classNames = useClassNames();

    const currentTab = ref<'server' | 'client'>(environment === 'node' ? 'server' : 'client');
    const clientId = computed(() => props.standalone ? internalClientId.value : undefined);

    const { logs: consoleData, reset: resetConsole } = useSandpackConsole({
      maxMessageCount: props.maxMessageCount,
      showSyntaxError: props.showSyntaxError,
      resetOnPreviewRestart: props.resetOnPreviewRestart,
      clientId: clientId.value,
    });

    const { logs: stdoutData, reset: resetStdout } = useSandpackShellStdout({
      maxMessageCount: props.maxMessageCount,
      resetOnPreviewRestart: props.resetOnPreviewRestart,
      clientId: clientId.value,
    });
    const isServerTab = computed(() => currentTab.value === 'server');
    const isNodeEnvironment = computed(() => environment === 'node');

    expose({
      reset() {
        resetConsole();
        resetStdout();
      },
    });

    watch(
      [
        () => props.onLogsChange,
        consoleData,
        stdoutData,
        currentTab,
      ],
      () => {
        if (props.onLogsChange) {
          props.onLogsChange(toRaw(consoleData.value));
        }

        nextTick(() => {
          setTimeout(() => {
            if (wrapperRef.value) {
              wrapperRef.value.scrollTop = wrapperRef.value.scrollHeight;
            }
          });
        });
      },
    );

    return () => (
      <SandpackStack
        {...props}
        class={classNames('console', [
          css({
            height: '100%',
            background: '$surface1',
            iframe: { display: 'none' },
            [`.${THEME_PREFIX}-bridge-frame`]: {
              display: 'block',
              border: 0,
              position: 'absolute',
              left: '$space$2',
              bottom: '$space$2',
              zIndex: '$top',
              height: 12,
              width: '30%',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            },
          }),
          attrs?.class || '',
        ])}
      >
        {
          props.showHeader && isNodeEnvironment.value && (
            <Header
              currentTab={currentTab.value}
              node={isNodeEnvironment.value}
              setCurrentTab={(val) => { currentTab.value = val; }}
            />
          )
        }

        <div
          ref={wrapperRef}
          class={classNames('console-list', [
            css({ overflow: 'auto', scrollBehavior: 'smooth' }),
          ])}
        >
          {
            isServerTab.value ? (
              <StdoutList data={stdoutData.value} />
            ) : (
              <ConsoleList data={consoleData.value} />
            )
          }
        </div>

        <div
          class={classNames('console-actions', [
            css({
              position: 'absolute',
              bottom: '$space$2',
              right: '$space$2',
              display: 'flex',
              gap: '$space$2',
            }),
          ])}
        >
          {
            slots.actionsChildren
              ? slots.actionsChildren()
              : props.actionsChildren ? props.actionsChildren : null
          }

          {
            props.showRestartButton && isServerTab.value && (
              <RoundedButton
                onClick={() => {
                  restart();
                  resetConsole();
                  resetStdout();
                }}
              >
                <RestartIcon />
              </RoundedButton>
            )
          }

          {
            props.showResetConsoleButton && (
              <RoundedButton
                onClick={() => {
                  if (currentTab.value === 'client') {
                    resetConsole();
                  } else {
                    resetStdout();
                  }
                }}
              >
                <CleanIcon />
              </RoundedButton>
            )
          }
        </div>

        {props.standalone && (
          <>
            <DependenciesProgress clientId={clientId.value} />
            <iframe title="console" ref={iframe}></iframe>
          </>
        )}
      </SandpackStack>
    );
  },
}) as DefineComponent<SandpackConsoleProps>;
