import { useClasser } from 'code-hike-classer-vue3';
import { DefineComponent, defineComponent, onUnmounted, onMounted, ref, PropType, computed } from 'vue';
import { ErrorOverlay } from '../../common/ErrorOverlay';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { CodeViewerProps, SandpackCodeViewer } from '../code-viewer';
import { useSandpack } from '../../contexts/sandpackContext';
import { Decorators } from '../code-editor';
import { SandpackInitMode } from '../../types';

export const SandpackTranspiledCode = defineComponent({
  name: 'SandpackTranspiledCode',
  inheritAttrs: true,
  props: {
    showTabs: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    showLineNumbers: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    decorators: {
      type: Array as PropType<Decorators>,
      required: false,
      default: undefined,
    },
    code: {
      type: String,
      required: false,
      default: undefined,
    },
    wrapContent: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    initMode: {
      type: String as PropType<SandpackInitMode>,
      required: false,
      default: undefined,
    },
  },
  // @ts-ignore
  setup(props: CodeViewerProps, { slots }) {
    const c = useClasser('sp');
    const { sandpack } = useSandpack();
    const hiddenIframeRef = ref<HTMLIFrameElement | null>(null);

    const bundlerState = computed(() => sandpack.bundlerState);
    const transpiledCode = computed(() => {
      const tModule = bundlerState.value?.transpiledModules[sandpack.activePath + ':'];
      return tModule?.source?.compiledCode ?? '';
    });

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
              {...props}
              code={sandpack.status === 'running' ? transpiledCode.value : ''}
              initMode={sandpack.initMode}
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
