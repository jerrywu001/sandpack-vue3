import { useSandpack } from '@codesandbox/sandpack-vue3';
import { defineComponent, onMounted, ref } from 'vue';

export const CustomPreview = defineComponent({
  name: 'CustomPreview',
  inheritAttrs: true,
  setup() {
    const { sandpack } = useSandpack();
    const iframeRef = ref<HTMLIFrameElement>();

    onMounted(() => {
      sandpack.registerBundler(iframeRef.value as HTMLIFrameElement, 'custom');
    });

    return () => (
      <>
        <iframe
          ref={iframeRef}
          style={{
            width: '400px',
            height: '400px',
          }}
          title="Sandpack Preview"
        />
      </>
    );
  },
});
