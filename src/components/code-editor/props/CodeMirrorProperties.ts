import { Decorators, FileType } from '..';
import { Extension } from '@codemirror/state';
import { KeyBinding } from '@codemirror/view';
import { PropType } from 'vue';
import type { EditorState as SandpackEditorState, SandpackInitMode } from '../../../types';

const CodeMirrorProperties = {
  onCodeUpdate: {
    type: Function as PropType<(newCode: string) => void>,
  },
  code: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
  filePath: {
    type: String,
  },
  fileType: {
    type: String as PropType<FileType>,
  },
  showLineNumbers: {
    type: Boolean,
    default: false,
  },
  showInlineErrors: {
    type: Boolean,
    default: false,
  },
  wrapContent: {
    type: Boolean,
    default: false,
  },
  editorState: {
    type: String as PropType<SandpackEditorState>,
    default: 'pristine',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  showReadOnly: {
    type: Boolean,
    default: true,
  },
  decorators: {
    type: Array as PropType<Decorators>,
    default() {
      return [];
    },
  },
  initMode: {
    type: String as PropType<SandpackInitMode>,
    default: 'lazy',
  },
  extensions: {
    type: Array as PropType<Extension[]>,
    default() {
      return [];
    },
  },
  extensionsKeymap: {
    type: Array as PropType<Array<readonly KeyBinding[]>>,
    default() {
      return [];
    },
  },
};

export default CodeMirrorProperties;
