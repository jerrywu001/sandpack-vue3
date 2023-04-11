import { useClassNames, stackClassName } from '../..';
import { css } from '../../styles';
import { computed, DefineComponent, defineComponent, onBeforeUnmount, onUnmounted, PropType, watch } from 'vue';
import { Directory } from './Directory';
import { File } from './File';
import { ModuleList } from './ModuleList';
import { useSandpack } from '../../contexts/sandpackContext';
import type { SandpackBundlerFiles, UnsubscribeFunction } from '@codesandbox/sandpack-client';

export interface SandpackFileExplorerProp {
  /**
   * enable auto hidden file in file explorer
   *
   * @description set with hidden property in files property
   * @default false
   */
  autoHiddenFiles?: boolean;

  initialCollapsedFolder?: string[];
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
    initialCollapsedFolder: {
      type: Array as PropType<Array<string> | undefined>,
      required: false,
      default() {
        return [];
      },
    },
  },
  setup(props, { attrs }) {
    let unsubscribe: UnsubscribeFunction;
    const { sandpack, listen } = useSandpack();
    const classNames = useClassNames();

    const orderedFiles = computed(() => Object.keys(sandpack.files)
      .sort()
      .reduce<SandpackBundlerFiles>((obj, key) => {
      obj[key] = sandpack.files[key];
      return obj;
    }, {}));

    watch(
      () => sandpack.status,
      () => {
        if (sandpack.status !== 'running') return;
        if (unsubscribe) unsubscribe();

        unsubscribe = listen((message) => {
          if (message.type === 'fs/change') {
            sandpack.updateFile(message.path, message.content, false);
          }

          if (message.type === 'fs/remove') {
            sandpack.deleteFile(message.path, false);
          }
        });

        return unsubscribe;
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      if (unsubscribe) unsubscribe();
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });

    return () => (
      <div
        class={classNames('file-explorer', [stackClassName, attrs?.class || ''])}
      >
        <div
          class={classNames('file-explorer-list', [fileExplorerClassName])}
        >
          <ModuleList
            activeFile={sandpack.activeFile}
            autoHiddenFiles={props.autoHiddenFiles}
            files={orderedFiles.value}
            initialCollapsedFolder={props?.initialCollapsedFolder ?? []}
            prefixedPath="/"
            selectFile={sandpack.openFile}
            visibleFiles={sandpack.visibleFilesFromProps}
          />
        </div>
      </div>
    );
  },
}) as DefineComponent<SandpackFileExplorerProp>;

export { Directory, File, ModuleList };
