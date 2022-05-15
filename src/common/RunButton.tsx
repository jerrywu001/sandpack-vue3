import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../contexts/sandpackContext';
import { defineComponent } from 'vue';
import { RunIcon } from '../icons';

export const RunButton = defineComponent({
  name: 'RunButton',
  inheritAttrs: true,
  setup() {
    const c = useClasser('sp');
    const { sandpack } = useSandpack();

    return () => (
      <button
        class={c('button')}
        onClick={(): void => sandpack.runSandpack()}
        style={{
          position: 'absolute',
          bottom: 'var(--sp-space-2)',
          right: 'var(--sp-space-2)',
        }}
        type="button"
      >
        <RunIcon />
        Run
      </button>
    );
  },
});
