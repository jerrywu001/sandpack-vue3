import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import { DefineComponent, defineComponent, PropType, ref } from 'vue';
import { ModuleList } from './ModuleList';
import { File } from './File';

export interface Props {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activePath: string;
  depth: number;
}

interface State {
  open: boolean;
}

/**
 * Directory
 */
export const Directory = defineComponent({
  name: 'Directory',
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
    const open = ref(true);

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
            activePath={props.activePath}
            depth={props.depth}
            files={props.files}
            prefixedPath={props.prefixedPath}
            selectFile={props.selectFile}
          />
        ) : null}
      </div>
    );
  },
}) as DefineComponent<Props>;
