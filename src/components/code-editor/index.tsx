import { CodeMirror } from './CodeMirror';
import {
  computed,
  CSSProperties,
  DefineComponent,
  defineComponent,
  PropType,
  ref,
} from 'vue';
import { FileTabs } from '../file-tabs';
import { SandpackStack } from '../../common';
import { useActiveCode } from '../../hooks';
import { useClasser } from 'code-hike-classer-vue3';

import type { EditorState as SandpackEditorState, SandpackInitMode } from '../../types';
import type { Extension } from '@codemirror/state';
import type { EditorView, KeyBinding } from '@codemirror/view';
import { RunButton } from '../../common/RunButton';
import { useSandpack } from '../../contexts/sandpackContext';

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
| 'vue';

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
  extensionsKeymap?: Array<readonly KeyBinding[]>;
}

export interface CodeEditorProps {
  customStyle?: CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
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
  extensionsKeymap?: Array<readonly KeyBinding[]>;
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
  inheritAttrs: true,
  props: {
    customStyle: {
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
  setup(props: CodeEditorProps, { slots }) {
    const { sandpack } = useSandpack();
    const { code, readOnly: readOnlyFile } = useActiveCode();
    const shouldShowTabs = computed(() => (props.showTabs ?? sandpack?.openPaths?.length > 1));
    const showRunButton = computed(() => !sandpack.autorun);

    const sandpackCodeEditorRef = ref<InstanceType<typeof CodeMirror> | null>(null);
    const c = useClasser('sp');

    const handleCodeUpdate = (newCode: string): void => {
      sandpack.updateCurrentFile(newCode);
    };

    return () => (
      <SandpackStack customStyle={props.customStyle}>
        {shouldShowTabs.value && <FileTabs closableTabs={props.closableTabs} />}

        <div class={c('code-editor')}>
          <CodeMirror
            key={sandpack.activePath}
            ref={sandpackCodeEditorRef}
            code={code.value}
            editorState={sandpack.editorState}
            extensions={props.extensions}
            extensionsKeymap={props.extensionsKeymap}
            filePath={sandpack.activePath}
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
