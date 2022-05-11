import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../contexts/sandpackContext';
import { DefineComponent, defineComponent, HtmlHTMLAttributes, PropType, Ref, ref, watch } from 'vue';
import { SandpackThemeProvider } from '../contexts/themeContext';
import type { SandpackThemeProp } from '../types';

export interface SandpackLayoutProps extends HtmlHTMLAttributes {
  theme?: SandpackThemeProp;
}

export const SandpackLayout = defineComponent({
  name: 'SandpackLayout',
  inheritAttrs: true,
  props: {
    theme: {
      type: [String, Object] as PropType<SandpackThemeProp>,
      required: false,
      default: undefined,
    },
  },
  setup(props: SandpackLayoutProps, { slots }) {
    const lazyAnchorRef = ref<HTMLDivElement>();
    const { sandpack } = useSandpack();
    const c = useClasser('sp');

    watch(lazyAnchorRef, () => {
      if (lazyAnchorRef.value) {
        sandpack.lazyAnchorRef = lazyAnchorRef as Ref<HTMLDivElement>;
      }
    });

    return () => (
      <SandpackThemeProvider theme={props.theme}>
        <div ref={lazyAnchorRef} class={c('layout')}>
        { slots.default ? slots.default() : null }
        </div>
      </SandpackThemeProvider>
    );
  },
}) as DefineComponent<SandpackLayoutProps>;
