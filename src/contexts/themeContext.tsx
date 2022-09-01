import { classNames } from '../utils/classNames';
import {
  DefineComponent,
  defineComponent,
  HTMLAttributes,
  InjectionKey,
  PropType,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import {
  createTheme,
  css,
  standardizeStitchesTheme,
  standardizeTheme,
  THEME_PREFIX,
} from '../styles';
import { SandpackTheme, SandpackThemeProp } from '../types';
import { useClasser } from 'code-hike-classer-vue3';

interface SandpackThemeProviderContext {
  theme: SandpackTheme;
  id: string;
  mode: 'dark' | 'light';
}

interface IProp extends HTMLAttributes {
  theme?: SandpackThemeProp;
  className?: string;
  mode?: 'dark' | 'light';
}

const wrapperClassName = css({
  all: 'initial',
  fontSize: '$font$size',
  fontFamily: '$font$body',
  display: 'block',
  boxSizing: 'border-box',
  textRendering: 'optimizeLegibility',
  WebkitTapHighlightColor: 'transparent',
  WebkitFontSmoothing: 'subpixel-antialiased',

  variants: {
    variant: {
      dark: { colorScheme: 'dark' },
      light: { colorScheme: 'light' },
    },
  },

  '@media screen and (min-resolution: 2dppx)': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  '*': { boxSizing: 'border-box' },
  '.sp-wrapper:focus': { outline: '0' },
});

const SandpackThemeContext: InjectionKey<SandpackThemeProviderContext> = Symbol('sandpackThemeProvider');

const SandpackThemeProvider = defineComponent({
  name: 'SandpackThemeProvider',
  props: {
    theme: {
      type: [String, Object] as PropType<SandpackThemeProp>,
      required: false,
      default: undefined,
    },
    className: {
      type: String,
      required: false,
      default: '',
    },
    mode: {
      type: String,
      required: false,
      default: 'light',
    },
  },
  setup(props, { slots }) {
    const { theme, id = '', mode = 'light' } = standardizeTheme(props.theme);
    const c = useClasser(THEME_PREFIX);
    const themeClassName = ref({} as any);
    const context = reactive({ theme, id, mode });

    if (context.theme) {
      themeClassName.value = createTheme(id, standardizeStitchesTheme(theme));
      provide(SandpackThemeContext, context);
    }

    const updateThemeState = () => {
      const { theme: newTheme, id: newId } = standardizeTheme(props.theme);
      if (props.theme) {
        context.id = newId;
        context.theme = newTheme;
        themeClassName.value = createTheme(newId, standardizeStitchesTheme(newTheme));
      }
    };

    watch(
      () => props.theme,
      updateThemeState,
      { immediate: true },
    );

    return () => (
      <div
        class={classNames(
          c('wrapper'),
          themeClassName.value.toString(),
          wrapperClassName({ variant: mode }),
          props.className,
        )}
      >
        { slots.default ? slots.default() : null }
      </div>
    );
  },
}) as DefineComponent<IProp>;

export { SandpackThemeProvider, SandpackThemeContext };

export type { SandpackThemeProviderContext };
