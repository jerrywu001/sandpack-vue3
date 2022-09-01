import { useClasser } from 'code-hike-classer-vue3';
import { defineComponent, PropType } from 'vue';
import { RunIcon } from '../../icons';
import { THEME_PREFIX } from '../../styles';
import {
  roundedButtonClassName,
  buttonClassName,
  iconStandaloneClassName,
} from '../../styles/shared';
import { classNames } from '../../utils/classNames';

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
    const c = useClasser(THEME_PREFIX);

    return () => (
      <button
        class={classNames(
          c('button', 'icon-standalone'),
          buttonClassName,
          iconStandaloneClassName,
          roundedButtonClassName,
        )}
        onClick={props.onClick}
        title="Run tests"
        type="button"
      >
        <RunIcon />
      </button>
    );
  },
});
