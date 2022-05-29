import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../contexts/sandpackContext';
import { defineComponent, PropType } from 'vue';
import { RunIcon } from '../icons';
import { classNames } from '../utils/classNames';
import { actionButtonClassName, buttonClassName } from '../styles/shared';
import { css, THEME_PREFIX } from '../styles';

const runButtonClassName = css({
  position: 'absolute',
  bottom: '$space$2',
  right: '$space$2',
  paddingRight: '$space$3',
});

export const RunButton = defineComponent({
  name: 'RunButton',
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
    onClick: {
      type: Function as PropType<((event: MouseEvent) => void) | undefined>,
      default: null,
    },
  },
  setup(props) {
    const c = useClasser(THEME_PREFIX);
    const { sandpack } = useSandpack();

    return () => (
      <button
        class={classNames(
          c('button'),
          buttonClassName,
          actionButtonClassName,
          runButtonClassName,
          props.className,
        )}
        onClick={(event) => {
          sandpack.runSandpack();
          if (props.onClick) {
            props.onClick(event);
          }
        }}
        type="button"
      >
        <RunIcon />
        Run
      </button>
    );
  },
});
