/* eslint-disable vue/one-component-per-file */
import type { TestError } from '@codesandbox/sandpack-client';

import { css } from '../../styles';
import { buttonClassName } from '../../styles/shared';
import { classNames } from '../../utils/classNames';

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
}

interface ISpecLabelProp {
  class: string;
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
  },
  setup(props: Props) {
    return () => (
      <>
        {props.specs.map((spec) => {
          if (spec.error) {
            return (
              <div key={spec.name} class={classNames(gapBottomClassName)}>
                <SpecLabel
                  class={classNames(labelClassName, failBackgroundClassName)}
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
            <div key={spec.name} class={classNames(gapBottomClassName)}>
              <div class={classNames(fileContainer)}>
                {props.status === 'complete' ? (
                  stats.fail > 0 ? (
                    <SpecLabel
                      class={classNames(
                        labelClassName,
                        failBackgroundClassName,
                      )}
                    >
                      Fail
                    </SpecLabel>
                  ) : (
                    <SpecLabel
                      class={classNames(
                        labelClassName,
                        passBackgroundClassName,
                      )}
                    >
                      Pass
                    </SpecLabel>
                  )
                ) : (
                  <SpecLabel
                    class={classNames(labelClassName, runBackgroundClassName)}
                  >
                    Run
                  </SpecLabel>
                )}

                <FilePath
                  onClick={() => { props.openSpec(spec.name); }}
                  path={spec.name}
                />
              </div>

              {props.verbose && <Tests tests={tests} />}

              {props.verbose && <Describes describes={describes} />}

              {getFailingTests(spec).map((test) => (
                <div
                  key={`failing-${test.name}`}
                  class={classNames(gapBottomClassName)}
                >
                  <div
                    class={classNames(failTestClassName, failTextClassName)}
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
  props: {
    class: {
      type: String,
      required: true,
    },
  },
  // @ts-ignore
  setup(props: ISpecLabelProp, { slots }) {
    return () => (
      <span class={classNames(specLabelClassName, props.class)}>
        {
          slots.default ? slots.default() : null
        }
      </span>
    );
  },
}) as DefineComponent<ISpecLabelProp>;

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

    return () => (
      <button
        class={classNames(buttonClassName, filePathButtonClassName)}
        onClick={() => { props.onClick(); }}
      >
        <span class={classNames(filePathClassName)}>{basePath.value}</span>
        <span class={classNames(fileNameClassName)}>{fileName.value}</span>
      </button>
    );
  },
}) as DefineComponent<{ onClick: () => void; path: string }>;
