import { ClasserProvider, Classes } from 'code-hike-classer-vue3';
import {
  CodeEditorProps,
  PreviewProps,
  SandpackCodeEditor,
  SandpackPreview,
} from '../components';
import { SandpackLayout } from '../common';
import { SandpackProvider, SandpackProviderProps } from '../contexts/sandpackContext';
import {
  computed,
  defineComponent,
  PropType,
} from 'vue';
import {
  FileResolver,
  SandpackCodeOptions,
  SandpackFiles,
  SandpackInitMode,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackThemeProp,
} from '../types';
import type { CSSProperties, DefineComponent } from 'vue';
import type { SandpackLogLevel } from '@codesandbox/sandpack-client';
import { HeightProperty } from 'csstype';

interface SandpackOption {
  openPaths?: string[];
  activePath?: string;

  editorWidthPercentage?: number;
  editorHeight?: CSSProperties['height'];
  classes?: Record<string, string>;

  showNavigator?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  showOpenInCodeSandbox?: boolean;
  showTabs?: boolean;
  closableTabs?: boolean;
  wrapContent?: boolean;
  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  initModeObserverOptions?: IntersectionObserverInit;

  bundlerURL?: string;
  startRoute?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
  externalResources?: string[];

  autorun?: boolean;
  recompileMode?: 'immediate' | 'delayed';
  recompileDelay?: number;
  codeEditor?: SandpackCodeOptions;

  /**
   * This disables editing of content by the user in all files.
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;
  logLevel?: SandpackLogLevel;
}

export interface SandpackProps {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  theme?: SandpackThemeProp;

  options?: SandpackOption;
}

const SandpackPropValues = {
  files: {
    type: Object as PropType<SandpackFiles>,
    required: false,
  },
  template: {
    type: String as PropType<SandpackPredefinedTemplate>,
    required: false,
  },
  customSetup: {
    type: Object as PropType<SandpackSetup>,
    required: false,
  },
  theme: {
    type: [String, Object] as PropType<SandpackThemeProp>,
    required: false,
    default: 'default',
  },
  options: {
    type: Object as PropType<SandpackOption>,
    required: false,
  },
};

/**
 * Sandpack component
 */
const Sandpack = defineComponent({
  name: 'Sandpack',
  inheritAttrs: true,
  props: SandpackPropValues,
  setup(props, ctx) {
    // Combine files with customSetup to create the user input structure
    const userInputSetup = props.files
      ? {
        ...props.customSetup,
        files: {
          ...props.customSetup?.files,
          ...props.files,
        },
      }
      : props.customSetup;

    const previewOptions = computed<PreviewProps>(() => ({
      showNavigator: props.options?.showNavigator,
      showOpenInCodeSandbox: props?.options?.showOpenInCodeSandbox,
    }));

    const codeEditorOptions = computed<CodeEditorProps>(() => ({
      showTabs: props.options?.showTabs,
      showLineNumbers: props.options?.showLineNumbers,
      showInlineErrors: props.options?.showInlineErrors,
      wrapContent: props.options?.wrapContent,
      closableTabs: props.options?.closableTabs,
      initMode: props.options?.initMode,
      extensions: props.options?.codeEditor?.extensions,
      extensionsKeymap: props.options?.codeEditor?.extensionsKeymap,
      readOnly: props.options?.readOnly,
      showReadOnly: props.options?.showReadOnly,
    }));

    const providerOptions = computed<SandpackProviderProps>(() => ({
      openPaths: props.options?.openPaths,
      activePath: props.options?.activePath,
      recompileMode: props.options?.recompileMode,
      recompileDelay: props.options?.recompileDelay,
      autorun: props.options?.autorun ?? true,
      bundlerURL: props.options?.bundlerURL,
      startRoute: props.options?.startRoute,
      skipEval: props.options?.skipEval,
      fileResolver: props.options?.fileResolver,
      initMode: props.options?.initMode,
      initModeObserverOptions: props.options?.initModeObserverOptions,
      externalResources: props.options?.externalResources,
      logLevel: props.options?.logLevel,
    }));

    // Parts are set as `flex` values, so they set the flex shrink/grow
    // Cannot use width percentages as it doesn't work with
    // the automatic layout break when the component is under 700px
    const editorPart = computed(() => props.options?.editorWidthPercentage || 50);
    const previewPart = computed(() => 100 - editorPart.value);
    const editorHeight = computed(() => props.options?.editorHeight);

    return () => (
      <SandpackProvider
        customSetup={userInputSetup}
        template={props.template}
        {...providerOptions.value}
      >
        <ClasserProvider classes={(props.options?.classes || {}) as Classes}>
          <SandpackLayout theme={props.theme}>
            <SandpackCodeEditor
              {...codeEditorOptions.value}
              customStyle={{
                height: editorHeight.value as HeightProperty<string | number>,
                flexGrow: editorPart.value,
                flexShrink: editorPart.value,
                minWidth: 700 * (editorPart.value / (previewPart.value + editorPart.value)),
              }}
            />
            <SandpackPreview
              {...previewOptions.value}
              customStyle={{
                height: editorHeight.value as HeightProperty<string | number>,
                flexGrow: previewPart.value,
                flexShrink: previewPart.value,
                minWidth: 700 * (previewPart.value / (previewPart.value + editorPart.value)),
              }}
            />
          </SandpackLayout>
        </ClasserProvider>
      </SandpackProvider>
    );
  },
}) as DefineComponent<SandpackProps>;

export { Sandpack };
