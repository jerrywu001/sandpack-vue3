import Ansi from 'ansi-to-vue3';
import { type PropType, defineComponent } from 'vue';
import { css } from '../../styles';
import { useClassNames } from '../..';

export const StdoutList = defineComponent({
  name: 'StdoutList',
  props: {
    data: {
      type: Array as PropType<Array<{ data: string; id: string }>>,
      required: false,
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const classNames = useClassNames();

    return () => (
      <>
        {
          props.data.map(({ data, id }) => (
            <div
              key={id}
              class={classNames('console-item', [consoleItemClassName])}
            >
              <Ansi linkify>{data}</Ansi>
            </div>
          ))
        }
      </>
    );
  },
});

const consoleItemClassName = css({
  width: '100%',
  padding: '$space$3 $space$2',
  fontSize: '.85em',
  position: 'relative',
  whiteSpace: 'pre',

  '&:not(:first-child):after': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: '$colors$surface3',
  },
});
