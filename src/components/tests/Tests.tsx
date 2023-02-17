import { classNames } from '../../utils/classNames';
import { css } from '../../styles';
import {
  DefineComponent,
  defineComponent,
  HtmlHTMLAttributes,
  PropType,
} from 'vue';
import type { TestError } from '@codesandbox/sandpack-client';
import {
  failTextClassName,
  passTextClassName,
  skipTextClassName,
} from './style';

const testContainerClassName = css({
  marginLeft: '$space$4',
});

const containerClassName = css({
  marginBottom: '$space$2',
  color: '$colors$clickable',
});

const testClassName = css({
  marginBottom: '$space$2',
  color: '$colors$hover',
});

const durationClassName = css({
  marginLeft: '$space$2',
});

const gapRightClassName = css({
  marginRight: '$space$2',
});

type TestStatus = 'idle' | 'running' | 'pass' | 'fail';

export interface Test {
  name: string;
  blocks: string[];
  status: TestStatus;
  path: string;
  errors: TestError[];
  duration?: number | undefined;
}

interface SandpackTests extends HtmlHTMLAttributes {
  tests: Test[];
}

export const Tests = defineComponent({
  name: 'Tests',
  props: {
    tests: {
      type: Array as PropType<Test[]>,
      required: true,
    },
  },
  setup(props: SandpackTests) {
    return () => (
      <div class={classNames(testContainerClassName)}>
        {
          props.tests.map((test) => (
            <div key={test.name} class={classNames(containerClassName)}>
              {test.status === 'pass' && (
                <span class={classNames(passTextClassName, gapRightClassName)}>
                  ✓
                </span>
              )}
              {test.status === 'fail' && (
                <span class={classNames(failTextClassName, gapRightClassName)}>
                  ✕
                </span>
              )}
              {test.status === 'idle' && (
                <span class={classNames(skipTextClassName, gapRightClassName)}>
                  ○
                </span>
              )}
              <span class={classNames(testClassName)}>{test.name}</span>
              {test.duration !== undefined && (
                <span class={classNames(durationClassName)}>
                  ({test.duration} ms)
                </span>
              )}
            </div>
          ))
        }
      </div>
    );
  },
}) as DefineComponent<SandpackTests>;
