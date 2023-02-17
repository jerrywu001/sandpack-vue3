import { DefineComponent, defineComponent, PropType } from 'vue';

import { ConsoleIcon } from '../..';
import { css } from '../../styles';
import { buttonClassName, roundedButtonClassName } from '../../styles/shared';
import { classNames } from '../../utils/classNames';

import type { Status } from './SandpackTests';

const wrapperClassName = css({
  justifyContent: 'space-between',
  borderBottom: '1px solid $colors$surface2',
  padding: '0 $space$2',
  fontFamily: '$font$mono',
  height: '$layout$headerHeight',
  minHeight: '$layout$headerHeight',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
});

const flexClassName = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$space$2',
});

const buttonsClassName = classNames(
  buttonClassName,
  roundedButtonClassName,
  css({ padding: '$space$1 $space$3' }),
);

interface Props {
  setVerbose: () => void;
  setSuiteOnly: () => void;
  verbose: boolean;
  suiteOnly: boolean;
  status: Status;
  watchMode: boolean;
  setWatchMode: () => void;
  showSuitesOnly: boolean;
  showVerboseButton: boolean;
  showWatchButton: boolean;
  hideTestsAndSupressLogs: boolean;
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
    showVerboseButton: {
      type: Boolean,
      required: true,
    },
    showWatchButton: {
      type: Boolean,
      required: true,
    },
    hideTestsAndSupressLogs: {
      type: Boolean,
      required: true,
    },
  },
  // @ts-ignore
  setup(props: Props) {
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
              type="button"
            >
              Suite only
            </button>
          )}
          {
            props.showVerboseButton && (
              <button
                class={buttonsClassName}
                data-active={props.verbose}
                disabled={props.status === 'initialising' || props.hideTestsAndSupressLogs}
                onClick={props.setVerbose}
                type="button"
              >
                Verbose
              </button>
            )
          }
          {
            props.showWatchButton && (
              <button
                class={buttonsClassName}
                data-active={props.watchMode}
                disabled={props.status === 'initialising'}
                onClick={props.setWatchMode}
                type="button"
              >
                Watch
              </button>
            )
          }
        </div>
      </div>
    );
  },
}) as DefineComponent<Props>;
