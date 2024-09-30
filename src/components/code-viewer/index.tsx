import {
  CodeEditor,
  CustomLanguage,
  Decorators,
  FileTabs,
  SandpackInitMode,
  useSandpack,
  useClassNames,
} from '../..';
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from 'vue';
import { RunButton } from '../../common/RunButton';
import { SandpackStack } from '../../common/Stack';
import { useActiveCode } from '../../hooks/useActiveCode';
import { editorClassName } from '../code-editor/styles';

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
  /**
   * Provides a way to add custom language modes by supplying a language
   * type, applicable file extensions, and a LanguageSupport instance
   * for that syntax mode
   */
  additionalLanguages?: CustomLanguage[];
}

export const SandpackCodeViewer = defineComponent({
  name: 'SandpackCodeViewer',
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
      type: Object as PropType<Decorators>,
      required: false,
      default: undefined,
    },
    code: {
      type: String,
      required: false,
      default: undefined,
    },
    initMode: {
      type: String as PropType<SandpackInitMode>,
      required: false,
      default: undefined,
    },
    wrapContent: {
      type: String,
      required: false,
      default: undefined,
    },
    additionalLanguages: {
      type: Array as PropType<CustomLanguage[]>,
      required: false,
      default: undefined,
    },
  },
  // @ts-ignore
  setup(props: CodeViewerProps) {
    const { sandpack } = useSandpack();
    const { code: activeCode } = useActiveCode();
    const classNames = useClassNames();

    const sandpackCodeViewerRef = ref();
    const shouldShowTabs = computed(() => (props.showTabs ?? sandpack?.visibleFiles?.length > 1));

    return () => (
      <SandpackStack class={classNames('editor-viewer')}>
        {shouldShowTabs.value ? <FileTabs /> : null}

        <div class={classNames('code-editor', [editorClassName])}>
          <CodeEditor
            ref={sandpackCodeViewerRef}
            code={props.code ?? activeCode.value}
            // @ts-ignore
            additionalLanguages={props.additionalLanguages}
            decorators={props.decorators}
            filePath={sandpack.activeFile}
            initMode={props.initMode || sandpack.initMode}
            showLineNumbers={props.showLineNumbers}
            showReadOnly={false}
            wrapContent={props.wrapContent}
            readOnly
          />
        </div>

        {sandpack.status === 'idle' ? <RunButton /> : null}
      </SandpackStack>
    );
  },
});
