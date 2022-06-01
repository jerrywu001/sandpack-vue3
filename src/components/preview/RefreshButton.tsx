import { useClasser } from 'code-hike-classer-vue3';
import { THEME_PREFIX } from '../../styles';
import { DefineComponent, defineComponent } from 'vue';
import { useSandpackNavigation } from '../../hooks/useSandpackNavigation';
import { RefreshIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { actionButtonClassName, buttonClassName, iconStandaloneClassName } from '../../styles/shared';

interface RefreshButtonProps {
  clientId?: string;
}

export const RefreshButton = defineComponent({
  name: 'RefreshButton',
  inheritAttrs: true,
  props: {
    clientId: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  setup(props: RefreshButtonProps) {
    const { refresh } = useSandpackNavigation(props.clientId);
    const c = useClasser(THEME_PREFIX);

    return () => (
      <button
        class={classNames(
          c('button', 'icon-standalone'),
          buttonClassName,
          iconStandaloneClassName,
          actionButtonClassName,
        )}
        onClick={refresh}
        title="Refresh Sandpack"
        type="button"
      >
        <RefreshIcon />
      </button>
    );
  },
}) as DefineComponent<RefreshButtonProps>;
