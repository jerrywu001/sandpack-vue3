import { defineComponent } from 'vue';
import { useSandpack } from '../../contexts/sandpackContext';
import { Directory } from './Directory';
import { File } from './File';
import { ModuleList } from './ModuleList';

/**
 * FileExplorer
 */
export const FileExplorer = defineComponent({
  name: 'FileExplorer',
  inheritAttrs: true,
  setup() {
    const { sandpack } = useSandpack();

    return () => (
      <div>
        <ModuleList
          activePath={sandpack.activePath}
          files={sandpack.files}
          prefixedPath="/"
          selectFile={sandpack.openFile}
        />
      </div>
    );
  },
});

export { Directory, File, ModuleList };
