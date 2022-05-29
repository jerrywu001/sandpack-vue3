import { css } from '../../styles';
import { defineComponent } from 'vue';
import { useSandpack } from '../../contexts/sandpackContext';
import { Directory } from './Directory';
import { File } from './File';
import { ModuleList } from './ModuleList';
import { classNames } from '../../utils/classNames';

const fileExplorerClassName = css({
  padding: '$space$3',
  overflow: 'auto',
  height: '100%',
});

/**
 * SandpackFileExplorer
 */
export const SandpackFileExplorer = defineComponent({
  name: 'SandpackFileExplorer',
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const { sandpack } = useSandpack();

    return () => (
      <div class={classNames(fileExplorerClassName, props.className)}>
        <ModuleList
          activeFile={sandpack.activeFile}
          files={sandpack.files}
          prefixedPath="/"
          selectFile={sandpack.openFile}
        />
      </div>
    );
  },
});

export { Directory, File, ModuleList };
