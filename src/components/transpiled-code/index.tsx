import { useClasser } from 'code-hike-classer-vue3';
import { useTranspiledCode } from '../../hooks/useTranspiledCode';
import { DefineComponent, defineComponent, onUnmounted, onMounted, ref } from 'vue';
import { ErrorOverlay } from '../../common/ErrorOverlay';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { CodeViewerProps, SandpackCodeViewer } from '../code-viewer';
import { useSandpack } from '../../contexts/sandpackContext';

export const SandpackTranspiledCode = defineComponent({
  name: 'SandpackTranspiledCode',
  inheritAttrs: true,
  props: {
    clientId: {
      type: String,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
  },
  // @ts-ignore
  setup(props: CodeViewerProps, { slots }) {
    const { sandpack } = useSandpack();
    const transpiledCode = useTranspiledCode();
    const c = useClasser('sp');

    const hiddenIframeRef = ref<HTMLIFrameElement | null>(null);

    onMounted(() => {
      const hiddenIframe = hiddenIframeRef.value;

      if (hiddenIframe) {
        sandpack.registerBundler(hiddenIframe, 'hidden');
      }
    });

    onUnmounted(() => {
      sandpack.unregisterBundler('hidden');
    });

    return () => (
      <div class={c('transpiled-code')}>
        {
          transpiledCode.value && (
            <SandpackCodeViewer
              code={transpiledCode.value}
              initMode={sandpack.initMode}
              {...props}
            />
          )
        }
        <iframe
          ref={hiddenIframeRef}
          style={{ display: 'none' }}
          title="transpiled sandpack code"
        />
        <ErrorOverlay />
        <LoadingOverlay clientId="hidden" />
      </div>
    );
  },
}) as DefineComponent<CodeViewerProps>;
