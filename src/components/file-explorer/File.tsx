import { computed, DefineComponent, defineComponent } from 'vue';
import { DirectoryIcon, FileIcon } from '../../icons';

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: MouseEvent) => void;
  depth: number;
  isDirOpen?: boolean;
}

/**
 * File
 */
export const File = defineComponent({
  name: 'File',
  inheritAttrs: true,
  props: {
    path: {
      type: String,
    },
    selectFile: {
      type: Function,
      required: false,
      default: undefined,
    },
    active: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    onClick: {
      type: Function,
      required: false,
      default: undefined,
    },
    depth: {
      type: Number,
    },
    isDirOpen: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  // @ts-ignore
  setup(props: Props) {
    const fileName = computed(() => props.path.split('/').filter(Boolean).pop());

    const selectFile = () => {
      if (props.selectFile) {
        props.selectFile(props.path);
      }
    };

    return () => (
      <button
        class="sp-button sp-explorer"
        data-active={props.active}
        onClick={props.selectFile ? selectFile : props.onClick}
        style={{ paddingLeft: 8 * props.depth + 'px' }}
        type="button"
      >
        {
          props.selectFile ? <FileIcon /> : <DirectoryIcon isOpen={props.isDirOpen} />
        }
        { fileName.value }
      </button>
    );
  },
}) as DefineComponent<Props>;
