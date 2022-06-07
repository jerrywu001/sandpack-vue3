import {
  computed,
  ComputedRef,
  DefineComponent,
  defineComponent,
  inject,
  PropType,
} from 'vue';
import { Directory } from './Directory';
import { File } from './File';
import { fromPropsToModules } from './util';
import { SandpackFileExplorerProp, VisibleFilesContext } from '.';
import { SandpackOptions } from '../../types';
import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';

export interface ModuleListProps extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions['activeFile']>;
  depth?: number;
  autoHiddenFiles?: boolean;
}

/**
 * ModuleList
 */
export const ModuleList = defineComponent({
  name: 'ModuleList',
  inheritAttrs: true,
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
  },
  // @ts-ignore
  setup(props: ModuleListProps) {
    const visibleFiles = inject(VisibleFilesContext, []);

    const res = computed(() => fromPropsToModules({
      visibleFiles,
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
            prefixedPath={dir}
            selectFile={props.selectFile}
            visibleFiles={visibleFiles}
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
}) as DefineComponent<ModuleListProps>;
