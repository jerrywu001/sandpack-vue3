import CodeMirrorProperties from './props/CodeMirrorProperties';
import useDelayCodeEditor from './data/useDelayCodeEditor';
import { CodeMirrorProps } from '.';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue';
import { getFileName } from '../../utils/stringUtils';
import { useClasser } from 'code-hike-classer-vue3';
import type { DefineComponent } from 'vue';
import type { EditorState as SandpackEditorState } from '../../types';
import { Annotation, EditorSelection } from '@codemirror/state';
import type { SandpackMessage, UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { EditorView } from '@codemirror/view';
import { useSandpack } from '../../contexts/sandpackContext';
import { THEME_PREFIX } from '../../styles';
import { classNames } from '../../utils/classNames';
import { cmClassName, placeholderClassName, readOnlyClassName, tokensClassName } from './styles';

/**
 * code area
 */
const CodeMirror = defineComponent({
  name: 'CodeMirror',
  props: CodeMirrorProperties,
  // @ts-ignore
  setup(props: CodeMirrorProps, ctx) {
    let unsubscribe: UnsubscribeFunction;

    // ======= states ===========
    const {
      cmView,
      wrapperRef,
      languageExtension,
      internalCode,
      syntaxHighlightRender,
    } = useDelayCodeEditor(props);

    const c = useClasser(THEME_PREFIX);
    const { listen } = useSandpack();

    // ======= methods ===========
    const handleContainerKeyDown = (evt: KeyboardEvent): void => {
      if (evt.key === 'Enter' && cmView.value) {
        evt.preventDefault();
        cmView.value.contentDOM.focus();
      }
    };

    ctx.expose({
      getCodemirror: (): EditorView | undefined => cmView.value,
    });

    // ======= life circles =========
    onMounted(() => {
      nextTick(() => {
        // When the user clicks on a tab button on a larger screen
        // Avoid autofocus on mobile as it leads to a bad experience and an unexpected layout shift
        if (
          cmView.value &&
          props.editorState === 'dirty' &&
          window.matchMedia('(min-width: 768px)').matches
        ) {
          cmView.value.contentDOM.focus();
        }
      });
    });

    // ======= effects ===========
    watch(
      () => props.code, // Update editor when code passed as prop from outside sandpack changes
      (newCode) => {
        if (cmView.value && typeof newCode === 'string' && newCode !== internalCode.value) {
          const view = cmView.value;

          const selection = view.state.selection.ranges.some(
            ({ to, from }) => to > newCode.length || from > newCode.length,
          )
            ? EditorSelection.cursor(newCode.length)
            : view.state.selection;

          const changes = { from: 0, to: view.state.doc.length, insert: newCode };

          view.dispatch({ changes, selection });
        }
      },
      { immediate: true },
    );

    watch(
      [
        () => props.showInlineErrors,
      ],
      () => {
        if (!props.showInlineErrors) return;

        if (unsubscribe) unsubscribe();

        unsubscribe = listen((message: SandpackMessage) => {
          const view = cmView.value;

          if (message.type === 'success') {
            view?.dispatch({
              // @ts-ignore
              annotations: [new Annotation('remove-errors', true)],
            });
          } else if (
            message.type === 'action' &&
            message.action === 'show-error' &&
            message.path === props.filePath &&
            message.line
          ) {
            view?.dispatch({
              // @ts-ignore
              annotations: [new Annotation('show-error', message.line)],
            });
          }

          if (
            message.type === 'action' &&
            message.action === 'show-error' &&
            message.line
          ) {
            view?.dispatch({
              annotations: [
                {
                  type: 'error',
                  value: message.line,
                } as unknown as Annotation<unknown>,
              ],
            });
          }
        });
      },
      { immediate: true },
    );

    const gutterLineOffset = (): string => {
      // padding-left
      let offset = 4;

      if (props.showLineNumbers) {
        // line-number-gutter-width + gutter-padding
        offset += 6;
      }

      // line-padding
      if (!props.readOnly) {
        offset += 1;
      }

      return `var(--${THEME_PREFIX}-space-${offset})`;
    };

    onBeforeUnmount(() => {
      if (unsubscribe) unsubscribe();
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });

    // ======= render ===========
    return () => props.readOnly ? (
      <>
        <pre
          ref={wrapperRef}
          class={classNames(
            c('cm', props.editorState as SandpackEditorState, languageExtension),
            cmClassName,
            tokensClassName,
          )}
          translate="no"
        >
          <code
            class={classNames(c('pre-placeholder'), placeholderClassName)}
            style={{ marginLeft: gutterLineOffset() }}
          >
            {syntaxHighlightRender}
          </code>
        </pre>

        {props.readOnly && props.showReadOnly && (
          <span class={classNames(c('read-only'), readOnlyClassName)}>
            Read-only
          </span>
        )}
      </>
    ) : (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props
      <div
        ref={wrapperRef}
        aria-autocomplete="list"
        aria-label={
          props.filePath ? `Code Editor for ${getFileName(props.filePath)}` : 'Code Editor'
        }
        aria-multiline="true"
        onKeydown={handleContainerKeyDown}
        class={classNames(
          c('cm', props.editorState as SandpackEditorState, languageExtension),
          cmClassName,
          tokensClassName,
        )}
        role="textbox"
        tabindex={0}
        translate="no"
      >
       <pre
          class={classNames(c('pre-placeholder'), placeholderClassName)}
          style={{ marginLeft: gutterLineOffset() }}
        >
          {syntaxHighlightRender}
        </pre>
      </div>
    );
  },
}) as DefineComponent<CodeMirrorProps>;

export { CodeMirror };
