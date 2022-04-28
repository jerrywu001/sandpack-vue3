import { useClasser } from 'code-hike-classer-vue3';
import { injectThemeStyleSheet } from '../utils/domUtils';
import { createThemeObject, defaultLight } from '../themes';
import { SandpackTheme, SandpackThemeProp } from '../types';
import { DefineComponent, defineComponent, InjectionKey, PropType, provide, reactive, watch } from 'vue';

interface SandpackThemeProviderContext {
  theme: SandpackTheme;
  id: string;
}

const SandpackThemeContext: InjectionKey<SandpackThemeProviderContext> = Symbol('sandpackThemeProvider');

const SandpackThemeProvider = defineComponent({
  name: 'SandpackThemeProvider',
  inheritAttrs: true,
  props: {
    theme: {
      type: [String, Object] as PropType<SandpackThemeProp>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { theme, id: defaultId } = createThemeObject(props.theme);
    const context = reactive({ theme: theme || defaultLight, id: defaultId });
    const c = useClasser('sp');

    if (props.theme) {
      injectThemeStyleSheet(context.theme, context.id);
      provide(SandpackThemeContext, context);
    }

    const updateThemeState = () => {
      const { theme: newTheme, id } = createThemeObject(props.theme);
      if (props.theme) {
        injectThemeStyleSheet(newTheme || defaultLight, id);
        context.id = id;
        context.theme = newTheme;
      }
    };

    watch(() => props.theme, updateThemeState, { deep: true });

    return () => (
      <div class={c('wrapper', context.id)}>{ slots.default ? slots.default() : null }</div>
    );
  },
}) as DefineComponent<{ theme?: SandpackThemeProp }>;

export { SandpackThemeProvider, SandpackThemeContext };

export type { SandpackThemeProviderContext };
