import { useClasser } from 'code-hike-classer-vue3';
import { DefineComponent, defineComponent, onUnmounted, onMounted, ref, PropType, computed } from 'vue';
import { ErrorOverlay } from '../../common/ErrorOverlay';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { CodeViewerProps, SandpackCodeViewer } from '../code-viewer';
import { useSandpack } from '../../contexts/sandpackContext';
import { Decorators } from '../code-editor';
import { SandpackInitMode } from '../../types';
import { css, THEME_PREFIX } from '../../styles';
import { classNames } from '../../utils/classNames';
import { stackClassName } from '../..';

const transpiledCodeClassName = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  overflow: 'auto',
  minHeight: '160px',
  flex: 1,
});

export const SandpackTranspiledCode = defineComponent({
  name: 'SandpackTranspiledCode',
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
  setup(props: CodeViewerProps, { attrs }) {
    const { sandpack } = useSandpack();
    const c = useClasser(THEME_PREFIX);
    const hiddenIframeRef = ref<HTMLIFrameElement | null>(null);

    const bundlerState = computed(() => sandpack.bundlerState);
    const transpiledCode = computed(() => {
      const tModule = bundlerState.value?.transpiledModules[sandpack.activeFile + ':'];
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
      <div
        class={classNames(
          c('transpiled-code'),
          stackClassName,
          transpiledCodeClassName,
          attrs?.class || '',
        )}
      >
        <SandpackCodeViewer
          {...props}
          code={transpiledCode.value ?? ''}
          initMode={sandpack.initMode}
        />

        <iframe
          ref={hiddenIframeRef}
          style={{ display: 'none' }}
          title="transpiled sandpack code"
        />
        <ErrorOverlay clientId="hidden" />
        <LoadingOverlay clientId="hidden" showOpenInCodeSandbox={false} />
      </div>
    );
  },
}) as DefineComponent<CodeViewerProps>;
