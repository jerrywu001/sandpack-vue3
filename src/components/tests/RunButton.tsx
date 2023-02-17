import { RoundedButton } from '../../common/RoundedButton';
import { defineComponent, PropType } from 'vue';
import { RunIcon } from '../../icons';

export const RunButton = defineComponent({
  name: 'RunButton',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  // @ts-ignore
  setup(props: { onClick: () => void }) {
    return () => (
      <RoundedButton onClick={props.onClick} title="Run tests">
        <RunIcon />
      </RoundedButton>
    );
  },
});
