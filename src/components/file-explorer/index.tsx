import { classNames } from '../../utils/classNames';
import { css, THEME_PREFIX } from '../../styles';
import { DefineComponent, defineComponent } from 'vue';
import { Directory } from './Directory';
import { File } from './File';
import { ModuleList } from './ModuleList';
import { stackClassName } from '../..';
import { useSandpack } from '../../contexts/sandpackContext';

export interface SandpackFileExplorerProp {
  /**
   * enable auto hidden file in file explorer
   *
   * @description set with hidden property in files property
   * @default false
   */
  autoHiddenFiles?: boolean;
}

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
  props: {
    autoHiddenFiles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const { sandpack } = useSandpack();

    return () => (
      <div
        class={classNames(
          stackClassName,
          fileExplorerClassName,
          `${THEME_PREFIX}-file-explorer`,
          attrs?.class || '',
        )}
      >
        <ModuleList
          activeFile={sandpack.activeFile}
          autoHiddenFiles={props.autoHiddenFiles}
          files={sandpack.files}
          prefixedPath="/"
          selectFile={sandpack.openFile}
          visibleFiles={sandpack.visibleFilesFromProps}
        />
      </div>
    );
  },
}) as DefineComponent<SandpackFileExplorerProp>;

export { Directory, File, ModuleList };
