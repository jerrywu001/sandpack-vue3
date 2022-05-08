import { useClasser } from 'code-hike-classer-vue3';
import { DefineComponent, defineComponent } from 'vue';
import { useSandpackNavigation } from '../../hooks/useSandpackNavigation';
import { RefreshIcon } from '../../icons';

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
    const c = useClasser('sp');

    return () => (
      <button
        class={c('button', 'icon-standalone')}
        onClick={refresh}
        title="Refresh Sandpack"
        type="button"
      >
        <RefreshIcon />
      </button>
    );
  },
}) as DefineComponent<RefreshButtonProps>;
