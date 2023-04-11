import { defineComponent, PropType } from 'vue';
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from '../styles/shared';
import { useClassNames } from '..';

export const RoundedButton = defineComponent({
  name: 'RoundedButton',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    onClick: {
      type: Function as PropType<((payload: MouseEvent) => void)>,
      required: false,
      default: () => {},
    },
  },
  setup(props, { slots, attrs }) {
    const classNames = useClassNames();

    return () => (
      <button
        title={props.title}
        class={classNames('button', [
          classNames('icon-standalone'),
          buttonClassName,
          iconStandaloneClassName,
          roundedButtonClassName,
          attrs?.class || '',
        ])}
        onClick={props.onClick}
        type="button"
      >
        {slots.default ? slots.default() : null}
      </button>
    );
  },
});
