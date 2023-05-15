import { useClassNames } from '../..';
import { CodeMirror } from './CodeMirror';
import { editorClassName } from './styles';
import { FileTabs } from '../file-tabs';
import { RunButton } from '../../common/RunButton';
import { SandpackStack } from '../../common';
import { useActiveCode } from '../../hooks';
import { useSandpack } from '../../contexts/sandpackContext';
import {
  computed,
  defineComponent,
  PropType,
  ref,
  StyleValue,
} from 'vue';

import type { CustomLanguage, EditorState as SandpackEditorState, SandpackInitMode } from '../../types';
import type { Extension } from '@codemirror/state';
import type { EditorView, KeyBinding } from '@codemirror/view';

export type Decorators = Array<{
  className?: string;
  line: number;
  startColumn?: number;
  endColumn?: number;
  elementAttributes?: Record<string, string>;
}>;

export interface CodeMirrorRef {
  getCodemirror: () => EditorView | undefined;
}

export interface CodeMirrorProps {
  onCodeUpdate?: (newCode: string) => void;
  code: string;
  filePath?: string;
  fileType?: string;
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
  /**
   * Provides a way to add custom language modes by supplying a language
   * type, applicable file extensions, and a LanguageSupport instance
   * for that syntax mode
   */
  additionalLanguages?: CustomLanguage[];
}

export interface CodeEditorProps {
  // style?: CSSProperties;
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
   * This disables editing of the editor content by the user.
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;
  /**
   * Provides a way to add custom language modes by supplying a language
   * type, applicable file extensions, and a LanguageSupport instance
   * for that syntax mode
   */
  additionalLanguages?: CustomLanguage[];
}

export const SandpackCodeEditor = defineComponent({
  name: 'SandpackCodeEditor',
  props: {
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
    additionalLanguages: {
      type: Array as PropType<Array<CustomLanguage[]>>,
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

    const sandpackCodeEditorRef = ref<{ getCodemirror: () => EditorView | undefined; } | null >(null);
    const classNames = useClassNames();

    const handleCodeUpdate = (newCode: string, shouldUpdatePreview = true) => {
      sandpack.updateCurrentFile(newCode, shouldUpdatePreview);
    };

    return () => (
      <SandpackStack class={classNames('editor', [attrs?.class || ''])} style={(attrs?.style || {}) as StyleValue}>
        {shouldShowTabs.value && <FileTabs closableTabs={props.closableTabs} />}

        <div class={classNames('code-editor', [editorClassName])}>
          <CodeMirror
            key={sandpack.activeFile}
            ref={sandpackCodeEditorRef}
            code={code.value}
            editorState={sandpack.editorState}
            extensions={props.extensions}
            extensionsKeymap={props.extensionsKeymap}
            filePath={sandpack.activeFile}
            initMode={props.initMode || sandpack.initMode}
            onCodeUpdate={(newCode: string) => {
              handleCodeUpdate(newCode, sandpack.autoReload ?? true);
            }}
            readOnly={props.readOnly || readOnlyFile.value}
            showInlineErrors={props.showInlineErrors}
            showLineNumbers={props.showLineNumbers}
            showReadOnly={props.showReadOnly}
            wrapContent={props.wrapContent}
            additionalLanguages={props.additionalLanguages}
          />

          {
            (showRunButton.value && (!sandpack.autoReload || sandpack.status === 'idle')) ? <RunButton /> : null
          }
        </div>
      </SandpackStack>
    );
  },
});

export { CodeMirror as CodeEditor } from './CodeMirror';
