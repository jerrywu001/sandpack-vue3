import { classNames } from '../../utils/classNames';
import { CleanIcon } from '../../icons';
import { css } from '../../styles';
import { DefineComponent, defineComponent, PropType } from 'vue';
import { useClasser } from 'code-hike-classer-vue3';
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from '../../styles/shared';

interface IProp {
  onClick: () => void;
}

export const Button = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Button',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props: IProp) {
    const c = useClasser('sp');

    return () => (
      <button
        class={classNames(
          c('button', 'icon-standalone'),
          buttonClassName,
          iconStandaloneClassName,
          roundedButtonClassName,
          css({
            position: 'absolute',
            bottom: '$space$2',
            right: '$space$2',
          }),
        )}
        onClick={() => { props.onClick(); }}
      >
        <CleanIcon />
      </button>
    );
  },
}) as DefineComponent<IProp>;
