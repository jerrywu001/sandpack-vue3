import {
  defineComponent,
  PropType,
  ref,
} from 'vue';
import { File } from './File';
import { ModuleList } from './ModuleList';
import { SandpackFileExplorerProp } from '.';
import { SandpackOptions } from '../../types';
import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';

export interface Props extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions['activeFile']>;
  depth: number;
  visibleFiles?: NonNullable<SandpackOptions['visibleFiles']>;
  autoHiddenFiles?: boolean;
  initialCollapsedFolder?: string[];
}

/**
 * Directory
 */
export const Directory = defineComponent({
  name: 'Directory',
  props: {
    prefixedPath: {
      type: String,
    },
    files: {
      type: Object as PropType<SandpackBundlerFiles>,
    },
    selectFile: {
      type: Function as PropType<(path: string) => void>,
    },
    activeFile: {
      type: String as PropType<NonNullable<SandpackOptions['activeFile']>>,
    },
    depth: {
      type: Number,
      required: false,
      default: 0,
    },
    visibleFiles: {
      type: Array as PropType<NonNullable<SandpackOptions['visibleFiles']>>,
      required: false,
      default: undefined,
    },
    initialCollapsedFolder: {
      type: Array as PropType<Array<string> | undefined>,
      required: false,
      default() {
        return [];
      },
    },
    autoHiddenFiles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  // @ts-ignore
  setup(props: Props) {
    const open = ref(!props.initialCollapsedFolder?.includes(props.prefixedPath || ''));

    const toggleOpen = () => {
      open.value = !open.value;
    };

    return () => (
      <div key={props.prefixedPath}>
        <File
          depth={props.depth}
          isDirOpen={open.value}
          onClick={toggleOpen}
          path={props.prefixedPath + '/'}
        />

        {open.value ? (
          <ModuleList
            autoHiddenFiles={props.autoHiddenFiles}
            activeFile={props.activeFile}
            depth={props.depth + 1}
            files={props.files}
            initialCollapsedFolder={props.initialCollapsedFolder}
            prefixedPath={props.prefixedPath}
            selectFile={props.selectFile}
            visibleFiles={props.visibleFiles}
          />
        ) : null}
      </div>
    );
  },
});
