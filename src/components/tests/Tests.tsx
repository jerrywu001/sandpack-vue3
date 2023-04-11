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
import { useClassNames } from '../..';

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
    const classNames = useClassNames();

    return () => (
      <div class={classNames('test', [testContainerClassName])}>
        {
          props.tests.map((test) => (
            <div
              key={test.name}
              class={classNames('test-result', [containerClassName])}
            >
              {test.status === 'pass' && (
                <span
                  class={classNames('test-pass-text', [
                    passTextClassName,
                    gapRightClassName,
                  ])}
                >
                  ✓
                </span>
              )}
              {test.status === 'fail' && (
                <span
                  class={classNames('test-fail-text', [
                    failTextClassName,
                    gapRightClassName,
                  ])}
                >
                  ✕
                </span>
              )}
              {test.status === 'idle' && (
                <span
                  class={classNames('test-idle-text', [
                    skipTextClassName,
                    gapRightClassName,
                  ])}
                >
                  ○
                </span>
              )}
              <span class={classNames('test-name-text', [testClassName])}>
                {test.name}
              </span>
              {test.duration !== undefined && (
                <span
                  class={classNames('test-duration-text', [durationClassName])}
                >
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
