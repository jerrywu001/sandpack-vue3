import { SandpackPreview, SandpackPreviewRef, useSandpack } from '@codesandbox/sandpack-vue3';
import { defineComponent, ref, watch } from 'vue';

export const SandpackClient = defineComponent({
  name: 'SandpackClient',
  inheritAttrs: false,
  setup() {
    const { sandpack } = useSandpack();
    const previewRef = ref<SandpackPreviewRef>();

    watch(() => sandpack.status, () => {
      const client = previewRef.value?.getClient();
      const clientId = previewRef.value?.clientId;

      if (client && clientId) {
        console.log(client);
        console.log(sandpack.clients[clientId]);
      }
    });

    return () => (
      <SandpackPreview ref={previewRef} />
    );
  },
});
