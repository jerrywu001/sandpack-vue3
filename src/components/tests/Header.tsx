import { DefineComponent, defineComponent, PropType } from 'vue';

import { ConsoleIcon } from '../..';
import { css } from '../../styles';
import { roundedTestButtonClassName, buttonClassName } from '../../styles/shared';
import { classNames } from '../../utils/classNames';

import type { Status } from './SandpackTests';

const wrapperClassName = css({
  justifyContent: 'space-between',
  borderBottom: '1px solid $colors$surface2',
  padding: '$space$3 $space$2',
  fontFamily: '$font$mono',
  maxHeight: '$layout$headerHeight',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
});

const flexClassName = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$space$2',
});

interface Props {
  setVerbose: () => void;
  setSuiteOnly: () => void;
  verbose: boolean;
  suiteOnly: boolean;
  status: Status;
  watchMode: boolean;
  setWatchMode: () => void;
  showSuitesOnly: boolean;
}

export const Header = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Header',
  props: {
    setVerbose: {
      type: Function,
      required: true,
    },
    setSuiteOnly: {
      type: Function,
      required: true,
    },
    verbose: {
      type: Boolean,
      required: true,
    },
    suiteOnly: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String as PropType<Status>,
      required: true,
    },
    watchMode: {
      type: Boolean,
      required: true,
    },
    setWatchMode: {
      type: Function,
      required: true,
    },
    showSuitesOnly: {
      type: Boolean,
      required: true,
    },
  },
  // @ts-ignore
  setup(props: Props) {
    const buttonsClassName = classNames(
      buttonClassName,
      roundedTestButtonClassName,
      css({ padding: '$space$1 $space$3' }),
    );

    return () => (
      <div class={classNames(wrapperClassName, flexClassName)}>
        <div class={classNames(flexClassName)}>
          <p
            class={classNames(
              css({
                lineHeight: 1,
                margin: 0,
                color: '$colors$base',
                fontSize: '$font$size',

                display: 'flex',
                alignItems: 'center',

                gap: '$space$2',
              }),
            )}
          >
            <ConsoleIcon />
            Tests
          </p>
        </div>

        <div class={classNames(flexClassName)}>
          {props.showSuitesOnly && (
            <button
              class={buttonsClassName}
              data-active={props.suiteOnly}
              disabled={props.status === 'initialising'}
              onClick={props.setSuiteOnly}
            >
              Suite only
            </button>
          )}
          <button
            class={buttonsClassName}
            data-active={props.verbose}
            disabled={props.status === 'initialising'}
            onClick={props.setVerbose}
          >
            Verbose
          </button>
          <button
            class={buttonsClassName}
            data-active={props.watchMode}
            disabled={props.status === 'initialising'}
            onClick={props.setWatchMode}
          >
            Watch
          </button>
        </div>
      </div>
    );
  },
}) as DefineComponent<Props>;
