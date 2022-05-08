import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import { DefineComponent, defineComponent } from 'vue';
import { CloseIcon } from '../../icons';
import { calculateNearestUniquePath, getFileName } from '../../utils/stringUtils';

export interface FileTabsProps {
  /**
   * This adds a close button next to each file with a unique trigger to close it.
   */
  closableTabs?: boolean;
}

/**
 * FileTabs is a list of all open files, the active file, and its state.
 */
export const FileTabs = defineComponent({
  name: 'FileTabs',
  inheritAttrs: true,
  props: {
    closableTabs: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props: FileTabsProps) {
    const { sandpack } = useSandpack();
    const c = useClasser('sp');

    const handleCloseFile = (ev: MouseEvent): void => {
      ev.stopPropagation();
      const tabElm = (ev.target as HTMLElement).closest(
        '[data-active]',
      ) as HTMLElement;
      const pathToClose = tabElm?.getAttribute('title');
      if (!pathToClose) {
        return;
      }
      sandpack.closeFile(pathToClose);
    };

    const getTriggerText = (currentPath: string): string => {
      const documentFileName = getFileName(currentPath);

      const pathsWithDuplicateFileNames = sandpack.openPaths.reduce((prev, curr) => {
        if (curr === currentPath) {
          return prev;
        }

        const fileName = getFileName(curr);

        if (fileName === documentFileName) {
          prev.push(curr);
          return prev;
        }

        return prev;
      }, [] as string[]);

      if (pathsWithDuplicateFileNames.length === 0) {
        return documentFileName;
      } else {
        return calculateNearestUniquePath(
          currentPath,
          pathsWithDuplicateFileNames,
        );
      }
    };

    return () => (
      <div class={c('tabs')} translate="no">
        <div
          aria-label="Select active file"
          class={c('tabs-scrollable-container')}
          role="tablist"
        >
          {sandpack.openPaths.map((filePath) => (
            <button
              key={filePath}
              aria-selected={filePath === sandpack.activePath}
              class={c('tab-button')}
              data-active={filePath === sandpack.activePath}
              onClick={(): void => sandpack.setActiveFile(filePath)}
              role="tab"
              title={filePath}
              type="button"
            >
              {getTriggerText(filePath)}
              {props.closableTabs && sandpack.openPaths.length > 1 && (
                <span class={c('close-button')} onClick={handleCloseFile}>
                  <CloseIcon />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  },
}) as DefineComponent<FileTabsProps>;
