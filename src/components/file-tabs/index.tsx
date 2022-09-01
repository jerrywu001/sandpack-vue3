import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import { DefineComponent, defineComponent } from 'vue';
import { CloseIcon } from '../../icons';
import { calculateNearestUniquePath, getFileName } from '../../utils/stringUtils';
import { css, THEME_PREFIX } from '../../styles';
import { classNames } from '../../utils/classNames';
import { buttonClassName } from '../../styles/shared';

const tabsClassName = css({
  borderBottom: '1px solid $colors$surface2',
  background: '$colors$surface1',
});

const tabsScrollableClassName = css({
  padding: '0 $space$2',
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'stretch',
  minHeight: '40px',
  marginBottom: '-1px',
});

const closeButtonClassName = css({
  padding: '0 $space$1 0 $space$1',
  borderRadius: '$border$radius',
  marginLeft: '$space$1',
  width: '$space$5',
  visibility: 'hidden',

  svg: {
    width: '$space$3',
    height: '$space$3',
    display: 'block',
    position: 'relative',
    top: 1,
  },
});

export const tabButton = css({
  padding: '0 $space$2',
  height: '$layout$headerHeight',
  whiteSpace: 'nowrap',

  '&:focus': { outline: 'none' },
  '&:focus-visible': { boxShadow: 'inset 0 0 0 2px $colors$accent' },
  [`&:hover > .${closeButtonClassName}`]: { visibility: 'unset' },
});

export interface FileTabsProps {
  /**
   * This adds a close button next to each file with a unique trigger to close it.
   */
  closableTabs?: boolean;
  className?: string;
}

/**
 * FileTabs is a list of all open files, the active file, and its state.
 */
export const FileTabs = defineComponent({
  name: 'FileTabs',
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
    closableTabs: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  setup(props: FileTabsProps) {
    const { sandpack } = useSandpack();
    const c = useClasser(THEME_PREFIX);

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

      const pathsWithDuplicateFileNames = (sandpack.visibleFiles || []).reduce((prev, curr) => {
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
      <div
        class={classNames(c('tabs'), tabsClassName, props.className)}
        translate="no"
      >
        <div
          aria-label="Select active file"
          class={classNames(
            c('tabs-scrollable-container'),
            tabsScrollableClassName,
          )}
          role="tablist"
        >
          {(sandpack.visibleFiles || []).map((filePath) => (
            <button
              key={filePath}
              aria-selected={filePath === sandpack.activeFile}
              class={classNames(c('tab-button'), buttonClassName, tabButton)}
              data-active={filePath === sandpack.activeFile}
              onClick={(): void => sandpack.setActiveFile(filePath)}
              role="tab"
              title={filePath}
              type="button"
            >
              {getTriggerText(filePath)}
              {props.closableTabs && sandpack.visibleFiles.length > 1 && (
                <span
                  class={classNames(c('close-button'), closeButtonClassName)}
                  onClick={handleCloseFile}
                >
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
