import { useSandpack } from '../contexts/sandpackContext';
import { defineComponent, PropType } from 'vue';
import { RunIcon } from '../icons';
import { css } from '../styles';
import { RoundedButton } from './RoundedButton';

const runButtonClassName = css({
  position: 'absolute',
  bottom: '$space$2',
  right: '$space$2',
  paddingRight: '$space$3',
});

export const RunButton = defineComponent({
  name: 'RunButton',
  props: {
    onClick: {
      type: Function as PropType<((event: MouseEvent) => void) | undefined>,
      default: null,
    },
  },
  setup(props) {
    const { sandpack } = useSandpack();

    return () => (
      <RoundedButton
        class={runButtonClassName.toString()}
        onClick={(event) => {
          if (sandpack && sandpack.runSandpack) {
            sandpack.runSandpack();
          }
          if (props.onClick) {
            props.onClick(event);
          }
        }}
      >
        <RunIcon />
        <span>Run</span>
      </RoundedButton>
    );
  },
});
