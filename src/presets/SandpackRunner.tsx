import { ClasserProvider, Classes } from 'code-hike-classer-vue3';
import { SANDBOX_TEMPLATES } from '../templates';
import { SandpackLayout } from '../common';
import { SandpackPredefinedTemplate, SandpackSetup, SandpackThemeProp } from '../types';
import { SandpackPreview } from '../components';
import { SandpackProvider } from '../contexts/sandpackContext';
import { computed, DefineComponent, defineComponent, PropType } from 'vue';

interface SandpackRunnerOption {
  showNavigator?: boolean;
  bundlerUrl?: string;
  startRoute?: string;
  classes?: Record<string, string>;
}

export interface SandpackRunnerProps {
  code?: string;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
  theme?: SandpackThemeProp;
  options?: SandpackRunnerOption;
}

/**
 * SandpackRunner component
 */
const SandpackRunner = defineComponent({
  name: 'SandpackRunner',
  inheritAttrs: true,
  props: {
    code: {
      type: String,
      required: false,
      default: undefined,
    },
    template: {
      type: String as PropType<SandpackPredefinedTemplate>,
      required: false,
      default: undefined,
    },
    customSetup: {
      type: Object as PropType<SandpackSetup>,
      required: false,
      default: undefined,
    },
    options: {
      type: Object as PropType<SandpackRunnerOption>,
      required: false,
      default: undefined,
    },
    theme: {
      type: [String, Object] as PropType<SandpackThemeProp>,
      required: false,
      default: undefined,
    },
  },
  // @ts-ignore
  setup(props: SandpackRunnerProps, ctx) {
    const mainFile = computed(() => (props.customSetup?.main ?? SANDBOX_TEMPLATES[props.template || 'vanilla'].main));

    // Override the main file of the sandbox
    const userInput = computed(() => (props.code
      ? {
        ...props.customSetup,
        files: {
          ...props.customSetup?.files,
          [mainFile.value]: props.code,
        },
      }
      : props.customSetup));

    return () => (
      <SandpackProvider
        bundlerURL={props.options?.bundlerUrl}
        customSetup={userInput.value}
        startRoute={props.options?.startRoute}
        template={props.template}
      >
        <ClasserProvider classes={(props.options?.classes || {}) as Classes}>
          <SandpackLayout theme={props.theme}>
            <SandpackPreview showNavigator={props.options?.showNavigator} />
          </SandpackLayout>
        </ClasserProvider>
      </SandpackProvider>
    );
  },
}) as DefineComponent<SandpackRunnerProps>;

export { SandpackRunner };
