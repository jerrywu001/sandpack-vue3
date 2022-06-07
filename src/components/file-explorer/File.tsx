import { buttonClassName } from '../../styles/shared';
import { classNames } from '../../utils/classNames';
import { computed, DefineComponent, defineComponent } from 'vue';
import { css, THEME_PREFIX } from '../../styles';
import { DirectoryIcon, FileIcon } from '../../icons';
import { useClasser } from 'code-hike-classer-vue3';

const explorerClassName = css({
  borderRadius: '0',
  width: '100%',
  padding: 0,
  marginBottom: '$space$2',

  svg: {
    marginRight: '$space$1',
  },
});

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
    const c = useClasser(THEME_PREFIX);
    const fileName = computed(() => props.path.split('/').filter(Boolean).pop());

    const onClickButton = (event: MouseEvent): void => {
      if (props.selectFile) {
        props.selectFile(props.path);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    };

    return () => (
      <button
        class={classNames(
          c('button', 'explorer'),
          buttonClassName,
          explorerClassName,
        )}
        data-active={props.active}
        onClick={onClickButton}
        style={{ paddingLeft: 9 * props.depth + 'px' }}
        type="button"
      >
        {props.selectFile ? <FileIcon /> : <DirectoryIcon isOpen={props.isDirOpen} />}
        {fileName.value}
      </button>
    );
  },
}) as DefineComponent<Props>;
