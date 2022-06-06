import {
  CodeEditorProps,
  SandpackCodeEditor,
  SandpackPreview,
} from '../components';
import { SandpackLayout } from '../common';
import { SandpackProvider } from '../contexts/sandpackContext';
import {
  computed,
  defineComponent,
  PropType,
} from 'vue';
import {
  SandpackFiles,
  SandpackInternal,
  SandpackInternalOptions,
  SandpackInternalProps,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackThemeProp,
  TemplateFiles,
} from '../types';

const SandpackPropValues = {
  files: {
    type: Object as PropType<SandpackFiles>,
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
  theme: {
    type: [String, Object] as PropType<SandpackThemeProp>,
    required: false,
    default: undefined,
  },
  options: {
    type: Object,
    required: false,
    default: undefined,
  },
};

/**
 * Sandpack component
 */
// @ts-ignore
const Sandpack = defineComponent({
  name: 'Sandpack',
  inheritAttrs: true,
  props: SandpackPropValues,
  setup(props: SandpackInternalProps<unknown, SandpackPredefinedTemplate>) {
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
      id: props.options?.id,
    }));

    const providerOptions = computed<SandpackInternalOptions<SandpackFiles, SandpackPredefinedTemplate>>(() => ({
      /**
       * TS-why: Type 'string | number | symbol' is not assignable to type 'string'
       */
      activeFile: props.options?.activeFile as unknown as string,
      visibleFiles: props.options?.visibleFiles as unknown as string[],
      recompileMode: props.options?.recompileMode,
      recompileDelay: props.options?.recompileDelay,
      autorun: props.options?.autorun,
      bundlerURL: props.options?.bundlerURL,
      startRoute: props.options?.startRoute,
      skipEval: props.options?.skipEval,
      fileResolver: props.options?.fileResolver,
      initMode: props.options?.initMode,
      initModeObserverOptions: props.options?.initModeObserverOptions,
      externalResources: props.options?.externalResources,
      logLevel: props.options?.logLevel,
      classes: props.options?.classes,
    }));

    /**
     * Parts are set as `flex` values, so they set the flex shrink/grow
     * Cannot use width percentages as it doesn't work with
     * the automatic layout break when the component is under 700px
     */
    const editorPart = computed(() => props.options?.editorWidthPercentage || 50);
    const previewPart = computed(() => 100 - editorPart.value);
    const editorHeight = computed(() => {
      let height: string | number | undefined = props.options?.editorHeight;
      if (height) {
        height = typeof height === 'number' ? `${height}px` : height;
      }
      return props.options?.editorHeight ? height : undefined;
    });

    return () => (
      <SandpackProvider
        customSetup={props.customSetup}
        files={props.files as TemplateFiles<SandpackPredefinedTemplate>}
        options={providerOptions.value}
        template={props.template as SandpackPredefinedTemplate}
        theme={props.theme}
      >
        <SandpackLayout>
          <SandpackCodeEditor
            {...codeEditorOptions.value}
            style={{
              height: editorHeight.value,
              flexGrow: editorPart.value,
              flexShrink: editorPart.value,
              minWidth: `${700 * (editorPart.value / (previewPart.value + editorPart.value))}px`,
            }}
          />
          <SandpackPreview
            showNavigator={props.options?.showNavigator}
            showRefreshButton={props.options?.showRefreshButton}
            style={{
              height: editorHeight.value,
              flexGrow: previewPart.value,
              flexShrink: previewPart.value,
              minWidth: `${700 * (previewPart.value / (previewPart.value + editorPart.value))}px`,
            }}
          />
        </SandpackLayout>
      </SandpackProvider>
    );
  },
}) as SandpackInternal;

export { Sandpack };
