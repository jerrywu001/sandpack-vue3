/* eslint-disable vue/one-component-per-file */
import { ConsoleIcon } from '../icons';
import { SandpackTests } from '../components/tests';
import { css, THEME_PREFIX } from '../styles';
import { RoundedButton, SandpackLayout } from '../common';
import { SandpackProvider } from '../contexts/sandpackContext';
import {
  CodeEditorProps,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
} from '../components';
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
  onBeforeUnmount,
  type StyleValue,
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
import { SANDBOX_TEMPLATES, useClassNames } from '..';
import { SandpackRender } from './SandpackRender';

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
  rtl: {
    type: Boolean,
    required: false,
    default: false,
  },
};

/**
 * Sandpack component
 */
// @ts-ignore
const Sandpack = defineComponent({
  name: 'Sandpack',
  props: SandpackPropValues,
  setup(props: SandpackInternalProps<unknown, SandpackPredefinedTemplate>) {
    const counter = ref(0);
    const dragEventTargetRef = ref<any>(null);
    const horizontalSize = ref(props.options?.editorWidthPercentage ?? 50);
    /** just for console log */
    const verticalSize = ref(70);
    const consoleVisibility = ref(props.options?.showConsole ?? false);

    const rtlLayout = computed(() => (props?.rtl || props?.options?.rtl) ?? false);
    const resizablePanels = computed(() => props.options?.resizablePanels ?? true);
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
      additionalLanguages: props.options?.codeEditor?.additionalLanguages,
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
      autoReload: props.options?.autoReload,
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
    const rightColumnStyle = computed(() => ({
      flexGrow: 100 - horizontalSize.value,
      flexShrink: 100 - horizontalSize.value,
      flexBasis: 0,
      width: 100 - horizontalSize.value + '%',
      gap: consoleVisibility.value ? '1px' : '0',
      height: props.options?.editorHeight ? `${props.options?.editorHeight}px` : undefined, // use the original editor height
    }));

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const templateFiles = computed(() => SANDBOX_TEMPLATES[props.template!] ?? {});
    const mode = computed(() => (
      props.options?.layout
        ? props.options?.layout
        : 'mode' in templateFiles.value
          ? templateFiles.value.mode : 'preview'
    ));

    const actionsChildren = computed(() => props.options?.showConsoleButton ? (
      <ConsoleCounterButton
        counter={counter.value}
        onClick={() => { consoleVisibility.value = !consoleVisibility.value; }}
      />
    ) : undefined);

    const hasRightColumn = computed(() => props.options?.showConsole || props.options?.showConsoleButton);
    const customRightColumnStyle = computed(() => (
      hasRightColumn.value
        ? { class: THEME_PREFIX + '-preset-column', style: rightColumnStyle.value }
        : {}
    ));

    const topRowStyle = computed(() => hasRightColumn.value
      ? {
        flexGrow: verticalSize.value,
        flexShrink: verticalSize.value,
        flexBasis: 0,
        overflow: 'hidden',
      }
      : rightColumnStyle.value);

    const onDragMove = (event: MouseEvent) => {
      if (!dragEventTargetRef.value) return;

      event.preventDefault();

      const container = dragEventTargetRef.value.parentElement as
        | HTMLDivElement
        | undefined;

      if (!container) return;

      const direction = dragEventTargetRef.value.dataset.direction as
          | 'horizontal'
          | 'vertical';
      const isHorizontal = direction === 'horizontal';

      const { left, top, height, width } = container.getBoundingClientRect();
      const offset = isHorizontal
        ? ((event.clientX - left) / width) * 100
        : ((event.clientY - top) / height) * 100;
      const boundaries = Math.min(Math.max(offset, 25), 75);

      if (isHorizontal) {
        horizontalSize.value = rtlLayout.value ? 100 - boundaries : boundaries;
      } else {
        verticalSize.value = boundaries;
      }

      container.querySelectorAll(`.${THEME_PREFIX}-stack`).forEach((item) => {
        (item as HTMLDivElement).style.pointerEvents = 'none';
      });
    };

    const stopDragging = () => {
      const container = dragEventTargetRef.value?.parentElement as HTMLDivElement;

      if (container) {
        container.querySelectorAll(`.${THEME_PREFIX}-stack`).forEach((item) => {
          (item as HTMLDivElement).style.pointerEvents = '';
        });
        dragEventTargetRef.value = null;
      }
    };

    const classNames = useClassNames();

    watch(
      [() => props.options?.showConsole],
      () => {
        consoleVisibility.value = props.options?.showConsole ?? false;
      },
      { immediate: true },
    );

    watch(
      [() => props.options],
      () => {
        if (!resizablePanels.value) return;

        if (typeof document !== 'undefined') {
          document.body.removeEventListener('mousemove', onDragMove);
          document.body.removeEventListener('mouseup', stopDragging);
          document.body.addEventListener('mousemove', onDragMove);
          document.body.addEventListener('mouseup', stopDragging);
        }
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      if (typeof document !== 'undefined') {
        document.body.removeEventListener('mousemove', onDragMove);
        document.body.removeEventListener('mouseup', stopDragging);
      }
    });

    return () => (
      <SandpackProvider
        {...props}
        key={props.template}
        customSetup={props.customSetup}
        files={props.files as TemplateFiles<SandpackPredefinedTemplate>}
        options={providerOptions.value}
        template={props.template as SandpackPredefinedTemplate}
        theme={props.theme}
      >
        <SandpackLayout
          class={rtlLayout.value ? classNames('rtl-layout', [rtlLayoutClassName]) : ''}
        >
          {/* @ts-ignore */}
          <SandpackCodeEditor
            {...codeEditorOptions.value}
            style={{
              height: `${props.options?.editorHeight}px`, // use the original editor height
              flexGrow: horizontalSize.value,
              flexShrink: horizontalSize.value,
              flexBasis: 0,
              overflow: 'hidden',
            }}
          />

          {resizablePanels.value && (
            <div
              class={classNames('resize-handler', [
                dragHandler({ direction: 'horizontal' }),
              ])}
              data-direction="horizontal"
              onMousedown={(event) => {
                dragEventTargetRef.value = event.target;
              }}
              style={{
                left: `calc(${rtlLayout.value ? 100 - horizontalSize.value : horizontalSize.value}% - 5px)`,
              } as StyleValue}
            />
          )}

          <SandpackRender
            fragment={!hasRightColumn.value}
            {...customRightColumnStyle.value}
          >
            {mode.value === 'preview' && (
              <SandpackPreview
                actionsChildren={actionsChildren.value}
                showNavigator={props.options?.showNavigator}
                showRefreshButton={props.options?.showRefreshButton}
                style={topRowStyle.value}
              />
            )}
            {mode.value === 'tests' && (
              <SandpackTests
                standalone
                actionsChildren={actionsChildren.value}
                style={topRowStyle.value}
              />
            )}

            {mode.value === 'console' && (
              <SandpackConsole
                actionsChildren={actionsChildren.value}
                style={topRowStyle.value}
              />
            )}

            {(props.options?.showConsoleButton || consoleVisibility.value) && (
              <>
                {resizablePanels.value && consoleVisibility.value && (
                  <div
                    class={classNames('resize-handler', [
                      dragHandler({ direction: 'vertical' }),
                    ])}
                    data-direction="vertical"
                    onMousedown={(event) => {
                      dragEventTargetRef.value = event.target;
                    }}
                    style={{ top: `calc(${verticalSize.value}% - 5px)` } as StyleValue}
                  />
                )}

                <div
                  class={classNames('console-wrapper', [consoleWrapper])}
                  style={{
                    flexGrow: consoleVisibility.value ? 100 - verticalSize.value : 0,
                    flexShrink: consoleVisibility.value ? 100 - verticalSize.value : 0,
                    flexBasis: 0,
                  } as StyleValue}
                >
                  <SandpackConsole
                    onLogsChange={(logs) => { counter.value = logs.length; }}
                    showHeader={false}
                  />
                </div>
              </>
            )}
          </SandpackRender>
        </SandpackLayout>
      </SandpackProvider>
    );
  },
}) as SandpackInternal;

interface IConsoleCounterButtonProp {
  onClick: () => void;
  counter: number;
}

const ConsoleCounterButton = defineComponent({
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
    },
  },
  // @ts-ignore
  setup(props: IConsoleCounterButtonProp) {
    return () => (
      <RoundedButton class={buttonCounter.toString()} onClick={props.onClick}>
        <ConsoleIcon />
        {props.counter > 0 && <strong>{props.counter}</strong>}
      </RoundedButton>
    );
  },
});

const dragHandler = css({
  position: 'absolute',
  zIndex: '$top',

  variants: {
    direction: {
      vertical: {
        right: 0,
        left: 0,
        height: 10,
        cursor: 'ns-resize',
      },
      horizontal: {
        top: 0,
        bottom: 0,
        width: 10,
        cursor: 'ew-resize',
      },
    },
  },

  '@media screen and (max-width: 768px)': {
    display: 'none',
  },
});

const buttonCounter = css({
  position: 'relative',

  strong: {
    background: '$colors$clickable',
    color: '$colors$surface1',
    minWidth: '12px',
    height: '12px',
    padding: '0 2px',
    borderRadius: '12px',
    fontSize: '8px',
    lineHeight: '12px',
    position: 'absolute',
    top: '0',
    right: '0',
    fontWeight: 'normal',
  },
});

const consoleWrapper = css({
  transition: 'flex $transitions$default',
  width: '100%',
  overflow: 'hidden',
});

const rtlLayoutClassName = css({
  flexDirection: 'row-reverse',

  '@media screen and (max-width: 768px)': {
    flexFlow: 'wrap-reverse !important',
    flexDirection: 'initial',
  },
});

export { Sandpack };
