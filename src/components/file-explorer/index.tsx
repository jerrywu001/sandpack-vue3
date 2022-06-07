import { css } from '../../styles';
import { computed, DefineComponent, defineComponent, inject, InjectionKey, provide, ref } from 'vue';
import { useSandpack } from '../../contexts/sandpackContext';
import { Directory } from './Directory';
import { File } from './File';
import { ModuleList } from './ModuleList';
import { classNames } from '../../utils/classNames';
import { SandpackOptions } from '../../types';

export const VisibleFilesContext: InjectionKey<NonNullable<SandpackOptions['visibleFiles']>> = Symbol('VisibleFilesContext');

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
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
    autoHiddenFiles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { sandpack } = useSandpack();

    provide(VisibleFilesContext, sandpack.visibleFiles);

    return () => (
      <div class={classNames(fileExplorerClassName, props.className)}>
        <ModuleList
          activeFile={sandpack.activeFile}
          autoHiddenFiles={props.autoHiddenFiles}
          files={sandpack.files}
          prefixedPath="/"
          selectFile={sandpack.openFile}
        />
      </div>
    );
  },
}) as DefineComponent<SandpackFileExplorerProp>;

export { Directory, File, ModuleList };
