import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../contexts/sandpackContext';
import { DefineComponent, defineComponent, HtmlHTMLAttributes, PropType } from 'vue';
import { SandpackThemeProvider } from '../contexts/themeContext';
import type { SandpackThemeProp } from '../types';
import { useActiveCode } from '../hooks';

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
    },
  },
  setup(props: SandpackLayoutProps, { slots }) {
    const { sandpack } = useSandpack();
    const c = useClasser('sp');

    return () => (
      <SandpackThemeProvider theme={props.theme}>
        <div ref={sandpack.lazyAnchorRef} class={c('layout')}>
        { slots.default ? slots.default() : null }
        </div>
      </SandpackThemeProvider>
    );
  },
}) as DefineComponent<SandpackLayoutProps>;
