import type { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { useSandpack } from '@codesandbox/sandpack-vue3';
import { defineComponent, onMounted, onUnmounted } from 'vue';

export const SandpackListener = defineComponent({
  name: 'SandpackListener',
  inheritAttrs: false,
  setup() {
    let unsubscribe: UnsubscribeFunction;
    const { listen } = useSandpack();

    onMounted(() => {
      if (unsubscribe) unsubscribe();
      unsubscribe = listen((msg) => console.log(msg));
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });

    return () => null;
  },
});
