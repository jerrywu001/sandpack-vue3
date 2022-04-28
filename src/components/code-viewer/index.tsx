import { computed, DefineComponent, defineComponent, PropType, ref } from 'vue';
import { CodeEditor, Decorators, FileTabs, SandpackInitMode, useSandpack } from '../..';
import { RunButton } from '../../common/RunButton';
import { SandpackStack } from '../../common/Stack';
import { useActiveCode } from '../../hooks/useActiveCode';

export interface CodeViewerProps {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  /**
   * Provides a way to draw or style a piece of the content.
   */
  decorators?: Decorators;
  code?: string;
  wrapContent?: boolean;
  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
}

export const SandpackCodeViewer = defineComponent({
  name: 'SandpackCodeViewer',
  inheritAttrs: true,
  props: {
    showTabs: {
      type: Boolean,
      required: false,
      default: false,
    },
    showLineNumbers: {
      type: Boolean,
      required: false,
      default: false,
    },
    decorators: {
      type: Object as PropType<Decorators>,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    initMode: {
      type: String as PropType<SandpackInitMode>,
      required: false,
    },
    wrapContent: {
      type: String,
      required: false,
    },
  },
  // @ts-ignore
  setup(props: CodeViewerProps) {
    const { sandpack } = useSandpack();
    const { code: activeCode } = useActiveCode();

    const sandpackCodeViewerRef = ref();
    const shouldShowTabs = computed(() => (props.showTabs ?? sandpack?.openPaths?.length > 1));

    return () => (
      <SandpackStack>
        {shouldShowTabs.value ? <FileTabs /> : null}

        <CodeEditor
          ref={sandpackCodeViewerRef}
          code={props.code ?? activeCode.value}
          decorators={props.decorators}
          filePath={sandpack.activePath}
          initMode={props.initMode || sandpack.initMode}
          showLineNumbers={props.showLineNumbers}
          showReadOnly={false}
          wrapContent={props.wrapContent}
          readOnly
        />

        {sandpack.status === 'idle' ? <RunButton /> : null}
      </SandpackStack>
    );
  },
}) as DefineComponent<CodeViewerProps>;
