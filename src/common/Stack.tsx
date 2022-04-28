import { useClasser } from 'code-hike-classer-vue3';
import { CSSProperties, DefineComponent, defineComponent, PropType } from 'vue';

export const SandpackStack = defineComponent({
  name: 'SandpackStack',
  inheritAttrs: true,
  props: {
    customStyle: {
      type: Object as PropType<CSSProperties>,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props: { customStyle?: CSSProperties }, { slots }) {
    const c = useClasser('sp');

    return () => (
      <div class={c('stack')} style={props.customStyle}>{ slots.default ? slots.default() : null }</div>
    );
  },
}) as DefineComponent<{ customStyle?: CSSProperties }>;
