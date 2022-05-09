import CodeMirrorProperties from './props/CodeMirrorProperties';
import useDelayCodeEditor from './data/useDelayCodeEditor';
import { CodeMirrorProps } from '.';
import { defineComponent, nextTick, onMounted, watch } from 'vue';
import { getFileName } from '../../utils/stringUtils';
import { useClasser } from 'code-hike-classer-vue3';
import type { DefineComponent } from 'vue';
import type { EditorState as SandpackEditorState } from '../../types';
import { Annotation, EditorSelection } from '@codemirror/state';
import { SandpackMessage, UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { EditorView } from '@codemirror/view';
import { useSandpack } from '../../contexts/sandpackContext';

/**
 * code area
 */
const CodeMirror = defineComponent({
  name: 'CodeMirror',
  inheritAttrs: true,
  props: CodeMirrorProperties,
  // @ts-ignore
  setup(props: CodeMirrorProps, ctx) {
    let unsubscribe: UnsubscribeFunction;

    // ======= states ===========
    const {
      ariaId,
      cmView,
      wrapperRef,
      languageExtension,
      internalCode,
    } = useDelayCodeEditor(props);

    const c = useClasser('sp');
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
        if (cmView.value && newCode !== internalCode.value) {
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
              // Pass message to clean up inline error
              annotations: [
                {
                  type: 'clean-error',
                  value: null,
                } as unknown as Annotation<unknown>,
              ],

              // Trigger a doc change to remove inline error
              changes: {
                from: 0,
                to: view.state.doc.length,
                insert: view.state.doc,
              },
              selection: view.state.selection,
            });
          }

          if (
            message.type === 'action' &&
            message.action === 'show-error' &&
            'line' in message
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

    // ======= render ===========
    if (props.readOnly) {
      return () => (
        <pre
          ref={wrapperRef}
          class={c('cm', props.editorState as SandpackEditorState, languageExtension)}
          translate="no"
        >
          <code class={c('pre-placeholder')}>{props.code}</code>

          {props.readOnly && props.showReadOnly && (
            <span class={c('read-only')}>Read-only</span>
          )}
        </pre>
      );
    }

    return () => (
      <div
        ref={wrapperRef}
        aria-describedby={`enter-instructions-${ariaId.value}`}
        aria-label={
          props.filePath ? `Code Editor for ${getFileName(props.filePath)}` : 'Code Editor'
        }
        onKeydown={handleContainerKeyDown}
        class={c('cm', props.editorState as SandpackEditorState, languageExtension)}
        role="group"
        tabindex={0}
        translate="no"
      >
        <pre
          class={c('pre-placeholder')}
          style={{ marginLeft: props.showLineNumbers ? '28px' : 0 }}
        >
          {props.code}
        </pre>

        <>
          <p
            id={`enter-instructions-${ariaId.value}`}
            style={{ display: 'none' }}
          >
            To enter the code editing mode, press Enter. To exit the edit mode,
            press Escape
          </p>
          <p
            id={`exit-instructions-${ariaId.value}`}
            style={{ display: 'none' }}
          >
            You are editing the code. To exit the edit mode, press Escape
          </p>
        </>
      </div>
    );
  },
}) as DefineComponent<CodeMirrorProps>;

export { CodeMirror };
