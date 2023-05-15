/* eslint-disable vue/one-component-per-file */
import type { TestError } from '@codesandbox/sandpack-client';

import { css } from '../../styles';
import { buttonClassName } from '../../styles/shared';
import { useClassNames } from '../..';

import type { Describe } from './Describes';
import { Describes } from './Describes';
import { FormattedError } from './FormattedError';
import type { Status } from './SandpackTests';
import { Tests } from './Tests';
import {
  failBackgroundClassName,
  failTextClassName,
  passBackgroundClassName,
  runBackgroundClassName,
} from './style';
import { getFailingTests, getSpecTestResults, isEmpty } from './utils';
import { type DefineComponent, defineComponent, type PropType, computed } from 'vue';

export type Spec = { error?: TestError } & Describe;

interface Props {
  specs: Spec[];
  verbose: boolean;
  status: Status;
  openSpec: (name: string) => void;
  hideTestsAndSupressLogs?: boolean;
}

const fileContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '$space$2',
});

const gapBottomClassName = css({
  marginBottom: '$space$2',
});

const failTestClassName = css({
  fontWeight: 'bold',
});

const labelClassName = css({
  borderRadius: 'calc($border$radius / 2)',
});

const specLabelClassName = css({
  padding: '$space$1 $space$2',
  fontFamily: '$font$mono',
  textTransform: 'uppercase',
  marginRight: '$space$2',
});

const filePathButtonClassName = css({
  fontFamily: '$font$mono',
  cursor: 'pointer',
  display: 'inline-block',
});

const filePathClassName = css({
  color: '$colors$clickable',
  textDecorationStyle: 'dotted',
  textDecorationLine: 'underline',
});

const fileNameClassName = css({
  color: '$colors$hover',
  fontWeight: 'bold',
  textDecorationStyle: 'dotted',
  textDecorationLine: 'underline',
});

export const Specs = defineComponent({
  name: 'Specs',
  props: {
    specs: {
      type: Array as PropType<Spec[]>,
      required: true,
    },
    verbose: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String as PropType<Status>,
      required: true,
    },
    openSpec: {
      type: Function as PropType<(name: string) => void>,
      required: true,
    },
    hideTestsAndSupressLogs: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  setup(props: Props) {
    const classNames = useClassNames();

    return () => (
      <>
        {props.specs.map((spec) => {
          if (spec.error) {
            return (
              <div
                key={spec.name}
                class={classNames('test-spec', [gapBottomClassName])}
              >
                <SpecLabel
                  class={classNames('test-spec-error', [
                    labelClassName,
                    failBackgroundClassName,
                  ])}
                >
                  Error
                </SpecLabel>
                <FilePath
                  onClick={() => { props.openSpec(spec.name); }}
                  path={spec.name}
                />
                <FormattedError error={spec.error} path={spec.name} />
              </div>
            );
          }

          if (isEmpty(spec)) {
            return null;
          }

          const tests = Object.values(spec.tests);
          const describes = Object.values(spec.describes);
          const stats = getSpecTestResults(spec);

          return (
            <div
              key={spec.name}
              class={classNames('test-spec-name', [gapBottomClassName])}
            >
              <div
                class={classNames('test-spec-name-container', [
                  fileContainer,
                ])}
              >
                {props.status === 'complete' ? (
                  stats.fail > 0 ? (
                    <SpecLabel
                      class={classNames('test-spec-complete', [
                        labelClassName,
                        failBackgroundClassName,
                      ])}
                    >
                      Fail
                    </SpecLabel>
                  ) : (
                    <SpecLabel
                      class={classNames('test-spec-pass', [
                        labelClassName,
                        passBackgroundClassName,
                      ])}
                    >
                      Pass
                    </SpecLabel>
                  )
                ) : (
                  <SpecLabel
                    class={classNames('test-spec-run', [
                      labelClassName,
                      runBackgroundClassName,
                    ])}
                  >
                    Run
                  </SpecLabel>
                )}

                <FilePath
                  onClick={() => {
                    if (!props.hideTestsAndSupressLogs) {
                      props.openSpec(spec.name);
                    }
                  }}
                  path={spec.name}
                />
              </div>

              {props.verbose && !props.hideTestsAndSupressLogs && <Tests tests={tests} />}

              {props.verbose && !props.hideTestsAndSupressLogs && <Describes describes={describes} />}

              {!props.hideTestsAndSupressLogs && getFailingTests(spec).map((test) => (
                <div
                  key={`failing-${test.name}`}
                  class={classNames('test-spec-error', [
                    gapBottomClassName,
                  ])}
                >
                  <div
                    class={classNames('test-spec-error-text', [
                      failTestClassName,
                      failTextClassName,
                    ])}
                  >
                    ● {test.blocks.join(' › ')} › {test.name}
                  </div>
                  {test.errors.map((e) => (
                    <FormattedError
                      key={`failing-${test.name}-error`}
                      error={e}
                      path={test.path}
                    />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </>
    );
  },
}) as DefineComponent<Props>;

export const SpecLabel = defineComponent({
  name: 'SpecLabel',
  setup(_, { slots, attrs }) {
    const classNames = useClassNames();

    return () => (
      <span
        class={classNames('test-spec-label', [specLabelClassName, attrs?.class || ''])}
      >
        {
          slots.default ? slots.default() : null
        }
      </span>
    );
  },
});

export const FilePath = defineComponent({
  name: 'FilePath',
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  // @ts-ignore
  setup(props: { onClick: () => void; path: string }) {
    const parts = computed(() => props.path.split('/'));
    const basePath = computed(() => parts.value.slice(0, parts.value.length - 1).join('/') + '/');
    const fileName = computed(() => parts.value[parts.value.length - 1]);
    const classNames = useClassNames();

    return () => (
      <button
        class={classNames('test-filename', [
          buttonClassName,
          filePathButtonClassName,
        ])}
        onClick={() => { props.onClick(); }}
        type="button"
      >
        <span class={classNames('test-filename-base', [filePathClassName])}>
          {basePath.value}
        </span>
        <span class={classNames('test-filename-file', [fileNameClassName])}>
          {fileName.value}
        </span>
      </button>
    );
  },
});
