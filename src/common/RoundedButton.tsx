import { classNames } from '../utils/classNames';
import { defineComponent, PropType } from 'vue';
import { useClasser } from 'code-hike-classer-vue3';
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from '../styles/shared';

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
    const c = useClasser('sp');

    return () => (
      <button
        title={props.title}
        class={classNames(
          c('button', 'icon-standalone'),
          buttonClassName,
          iconStandaloneClassName,
          roundedButtonClassName,
          attrs?.class || '',
        )}
        onClick={props.onClick}
        type="button"
      >
        {slots.default ? slots.default() : null}
      </button>
    );
  },
});
