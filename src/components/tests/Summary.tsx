import { useClassNames } from '../..';
import { css } from '../../styles';
import { DefineComponent, defineComponent, PropType } from 'vue';
import {
  failTextClassName,
  passTextClassName,
  skipTextClassName,
} from './style';

export interface TestResults {
  pass: number;
  fail: number;
  skip: number;
  total: number;
}

export interface SuiteResults {
  pass: number;
  fail: number;
  total: number;
}

interface Props {
  suites: SuiteResults;
  tests: TestResults;
  duration: number;
}

const gapBottomClassName = css({
  marginBottom: '$space$2',
});

const labelClassName = css({
  fontWeight: 'bold',
  color: '$colors$hover',
  whiteSpace: 'pre-wrap',
});
const containerClassName = css({
  fontWeight: 'bold',
  color: '$colors$clickable',
});

export const Summary = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Summary',
  props: {
    suites: {
      type: Object as PropType<SuiteResults>,
      required: true,
    },
    tests: {
      type: Object as PropType<TestResults>,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  setup(props: Props) {
    const classNames = useClassNames();
    const widestLabel = 'Test suites: ';

    const withMargin = (label: string): string => {
      const difference = widestLabel.length - label.length;
      const margin = Array.from({ length: difference }, () => ' ').join('');
      return label + margin;
    };

    return () => (
      <div class={classNames('test-summary', [containerClassName])}>
        <div class={classNames('test-summary', [gapBottomClassName])}>
          <span
            class={classNames('test-summary-suites-label', [labelClassName])}
          >
            {widestLabel}
          </span>
          {props.suites.fail > 0 && (
            <span
              class={classNames('test-summary-suites-fail', [
                failTextClassName,
              ])}
            >
              {props.suites.fail} failed,{' '}
            </span>
          )}
          {props.suites.pass > 0 && (
            <span
              class={classNames('test-summary-suites-pass', [
                passTextClassName,
              ])}
            >
              {props.suites.pass} passed,{' '}
            </span>
          )}
          <span>{props.suites.total} total</span>
        </div>
        <div class={classNames('test-summary', [gapBottomClassName])}>
          <span class={classNames('test-summary-label', [labelClassName])}>
            {withMargin('Tests:')}
          </span>
          {props.tests.fail > 0 && (
            <span
              class={classNames('test-summary-fail', [failTextClassName])}
            >
              {props.tests.fail} failed,{' '}
            </span>
          )}
          {props.tests.skip > 0 && (
            <span
              class={classNames('test-summary-skip', [skipTextClassName])}
            >
              {props.tests.skip} skipped,{' '}
            </span>
          )}
          {props.tests.pass > 0 && (
            <span
              class={classNames('test-summary-pass', [passTextClassName])}
            >
              {props.tests.pass} passed,{' '}
            </span>
          )}
          <span>{props.tests.total} total</span>
        </div>
        <div class={classNames('test-summary-curation', [labelClassName])}>
          {withMargin('Time:')}
          {props.duration / 1000}s
        </div>
      </div>
    );
  },
}) as DefineComponent<Props>;
