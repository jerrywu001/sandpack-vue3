import { classNames } from '../../utils/classNames';
import { CodeMirror } from './CodeMirror';
import { editorClassName } from './styles';
import { FileTabs } from '../file-tabs';
import { RunButton } from '../../common/RunButton';
import { SandpackStack } from '../../common';
import { THEME_PREFIX } from '../../styles';
import { useActiveCode } from '../../hooks';
import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import {
  computed,
  CSSProperties,
  DefineComponent,
  defineComponent,
  PropType,
  ref,
  StyleValue,
} from 'vue';

import type { EditorState as SandpackEditorState, SandpackInitMode } from '../../types';
import type { Extension } from '@codemirror/state';
import type { EditorView, KeyBinding } from '@codemirror/view';

export type Decorators = Array<{
  className?: string;
  line: number;
  startColumn?: number;
  endColumn?: number;
  elementAttributes?: Record<string, string>;
}>;

export type FileType = 'js'
| 'jsx'
| 'ts'
| 'tsx'
| 'css'
| 'scss'
| 'less'
| 'html'
| 'vue'
| 'markdown';

export interface CodeMirrorRef {
  getCodemirror: () => EditorView | undefined;
}

export interface CodeMirrorProps {
  onCodeUpdate?: (newCode: string) => void;
  id?: string;
  code: string;
  filePath?: string;
  fileType?: FileType;
  /**
   * @default false
   */
  showLineNumbers?: boolean;
  /**
   * @default false
   */
  showInlineErrors?: boolean;
  /**
   * @default false
   */
  wrapContent?: boolean;
  /**
   * @default 'pristine'
   */
  editorState?: SandpackEditorState;
  /**
   * This disables editing of content by the user in all files.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   * @default true
   */
  showReadOnly?: boolean;
  /**
   * Provides a way to draw or style a piece of the content.
   */
  decorators?: Decorators;
  /**
   * @default 'lazy'
   */
  initMode: SandpackInitMode;
  /**
   * @default []
   */
  extensions?: Extension[];
  /**
   * @default []
   */
  extensionsKeymap?: KeyBinding[];
}

export interface CodeEditorProps {
  style?: CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  showRunButton?: boolean;
  wrapContent?: boolean;
  closableTabs?: boolean;
  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  /**
   * CodeMirror extensions for the editor state, which can
   * provide extra features and functionalities to the editor component.
   */
  extensions?: Extension[];
  /**
   * Property to register CodeMirror extension keymap.
   */
  extensionsKeymap?: KeyBinding[];
  /**
   * By default, Sandpack generates a random value to use as an id.
   * Use this to override this value if you need predictable values.
   */
  id?: string;
  /**
   * This disables editing of the editor content by the user.
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;
}

export const SandpackCodeEditor = defineComponent({
  name: 'SandpackCodeEditor',
  props: {
    style: {
      type: Object as PropType<CSSProperties>,
      required: false,
      default: undefined,
    },
    showTabs: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    showLineNumbers: {
      type: Boolean,
      required: false,
      default: false,
    },
    showInlineErrors: {
      type: Boolean,
      required: false,
      default: false,
    },
    wrapContent: {
      type: Boolean,
      required: false,
      default: false,
    },
    closableTabs: {
      type: Boolean,
      required: false,
    },
    initMode: {
      type: String as PropType<SandpackInitMode>,
      required: false,
      default: undefined,
    },
    extensions: {
      type: Array as PropType<Extension[]>,
      required: false,
      default: undefined,
    },
    extensionsKeymap: {
      type: Array as PropType<Array<readonly KeyBinding[]>>,
      required: false,
      default: undefined,
    },
    id: {
      type: String,
      required: false,
      default: undefined,
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    showReadOnly: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  // @ts-ignore
  setup(props: CodeEditorProps, { attrs }) {
    const { sandpack } = useSandpack();
    const { code, readOnly: readOnlyFile } = useActiveCode();
    const shouldShowTabs = computed(() => (props.showTabs ?? sandpack?.visibleFiles?.length > 1));
    const showRunButton = computed(() => !sandpack?.autorun);

    const sandpackCodeEditorRef = ref<InstanceType<typeof CodeMirror> | null>(null);
    const c = useClasser(THEME_PREFIX);

    const handleCodeUpdate = (newCode: string): void => {
      sandpack.updateCurrentFile(newCode);
    };

    return () => (
      <SandpackStack class={c('editor')} style={(attrs?.style || {}) as StyleValue}>
        {shouldShowTabs.value && <FileTabs closableTabs={props.closableTabs} />}

        <div class={classNames(c('code-editor'), editorClassName)}>
          <CodeMirror
            key={sandpack.activeFile}
            ref={sandpackCodeEditorRef}
            code={code.value}
            editorState={sandpack.editorState}
            extensions={props.extensions}
            extensionsKeymap={props.extensionsKeymap}
            filePath={sandpack.activeFile}
            id={props.id}
            initMode={props.initMode || sandpack.initMode}
            onCodeUpdate={handleCodeUpdate}
            readOnly={props.readOnly || readOnlyFile.value}
            showInlineErrors={props.showInlineErrors}
            showLineNumbers={props.showLineNumbers}
            showReadOnly={props.showReadOnly}
            wrapContent={props.wrapContent}
          />

          { showRunButton.value && sandpack.status === 'idle' ? <RunButton /> : null }
        </div>
      </SandpackStack>
    );
  },
}) as DefineComponent<CodeEditorProps>;

export { CodeMirror as CodeEditor } from './CodeMirror';
