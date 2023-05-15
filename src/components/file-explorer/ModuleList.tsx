import {
  computed,
  ComputedRef,
  defineComponent,
  PropType,
} from 'vue';
import { Directory } from './Directory';
import { File } from './File';
import { fromPropsToModules } from './util';
import { SandpackFileExplorerProp } from '.';
import { SandpackOptions } from '../../types';
import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';

export interface ModuleListProps extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions['activeFile']>;
  visibleFiles?: NonNullable<SandpackOptions['visibleFiles']>;
  depth?: number;
  autoHiddenFiles?: boolean;
  initialCollapsedFolder?: string[];
}

/**
 * ModuleList
 */
export const ModuleList = defineComponent({
  name: 'ModuleList',
  props: {
    prefixedPath: {
      type: String,
    },
    files: {
      type: Object as PropType<SandpackBundlerFiles>,
    },
    selectFile: {
      type: Function,
    },
    activeFile: {
      type: String as PropType<NonNullable<SandpackOptions['activeFile']>>,
    },
    depth: {
      type: Number,
      required: false,
      default: 0,
    },
    autoHiddenFiles: {
      type: Boolean,
      required: false,
      default: false,
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
  },
  // @ts-ignore
  setup(props: ModuleListProps) {
    const res = computed(() => fromPropsToModules({
      visibleFiles: props.visibleFiles as string[],
      autoHiddenFiles: props.autoHiddenFiles,
      prefixedPath: props.prefixedPath,
      files: props.files,
    })) as ComputedRef<{ directories: string[]; modules: string[] }>;

    return () => (
      <div>
        {Array.from(res.value.directories).map((dir) => (
          <Directory
            key={dir}
            activeFile={props.activeFile}
            autoHiddenFiles={props.autoHiddenFiles}
            depth={props.depth as number}
            files={props.files}
            initialCollapsedFolder={props.initialCollapsedFolder}
            prefixedPath={dir}
            selectFile={props.selectFile}
            visibleFiles={props.visibleFiles as string[]}
          />
        ))}

        {res.value.modules.map((path) => (
          <File
            key={path}
            active={props.activeFile === path}
            depth={props.depth as number}
            path={path}
            selectFile={props.selectFile}
          />
        ))}
      </div>
    );
  },
});
