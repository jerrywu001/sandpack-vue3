import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import { computed, DefineComponent, defineComponent, PropType } from 'vue';

import { Directory } from './Directory';
import { File } from './File';

export interface Props {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activePath: string;
  depth?: number;
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
    activePath: {
      type: String,
    },
    depth: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  // @ts-ignore
  setup(props: Props) {
    const fileListWithoutPrefix = computed(() => Object.keys(props.files)
      .filter((file) => file.startsWith(props.prefixedPath))
      .map((file) => file.substring(props.prefixedPath.length)));

    const directoriesToShow = computed(() => new Set(
      fileListWithoutPrefix.value
        .filter((file) => file.includes('/'))
        .map((file) => `${props.prefixedPath}${file.split('/')[0]}/`),
    ));

    const filesToShow = computed(() => fileListWithoutPrefix.value
      .filter((file) => !file.includes('/'))
      .map((file) => ({ path: `${props.prefixedPath}${file}` })));

    return () => (
      <div>
        {Array.from(directoriesToShow.value).map((dir) => (
          <Directory
            key={dir}
            activePath={props.activePath}
            depth={props.depth as number + 1}
            files={props.files}
            prefixedPath={dir}
            selectFile={props.selectFile}
          />
        ))}

        {filesToShow.value.map((file) => (
          <File
            key={file.path}
            active={props.activePath === file.path}
            depth={props.depth as number + 1}
            path={file.path}
            selectFile={props.selectFile}
          />
        ))}
      </div>
    );
  },
}) as DefineComponent<Props>;
