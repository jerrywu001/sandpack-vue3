import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { CodeMirrorProps } from '..';
import { commentKeymap } from '@codemirror/comment';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { EditorState, Extension, StateEffect } from '@codemirror/state';
import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getLanguageFromFile,
  getSyntaxHighlight,
} from '../utils';
import { highlightDecorators } from '../highlightDecorators';
import { highlightInlineError } from '../highlightInlineError';
import { history, historyKeymap } from '@codemirror/history';
import { lineNumbers } from '@codemirror/gutter';
import { shallowEqual } from '../../../utils/array';
import { useGeneratedId } from '../useGeneratedId';
import { useSandpackTheme } from '../../../hooks';
import { useSyntaxHighlight } from '../useSyntaxHighlight';
import {
  computed,
  watch,
  ref,
  onMounted,
  nextTick,
  onUnmounted,
} from 'vue';
import {
  type KeyBinding,
  highlightSpecialChars,
  highlightActiveLine,
  keymap,
  EditorView,
} from '@codemirror/view';
import {
  defaultKeymap,
  indentLess,
  deleteGroupBackward,
  insertTab,
} from '@codemirror/commands';

export default function useDelayCodeEditor(props: CodeMirrorProps) {
  // ===== vars & states ========
  let timer: NodeJS.Timer;

  const sandpackTheme = useSandpackTheme();
  const languageExtension = getLanguageFromFile(props.filePath, props.fileType);
  const langSupport = getCodeMirrorLanguage(languageExtension);
  const highlightTheme = getSyntaxHighlight(sandpackTheme.theme);

  const syntaxHighlightRender = useSyntaxHighlight({
    langSupport,
    highlightTheme,
    code: props.code,
  });

  const internalCode = ref<string>(props.code);
  const wrapperRef = ref<HTMLDivElement>();
  const cmView = ref<EditorView>();
  const ariaId = useGeneratedId(props.id);
  const isIntersecting = ref(false);

  const theInitMode = computed(() => props.initMode || 'lazy');

  // decorators need to be sorted by `line`, otherwise it will throw error
  // see https://github.com/codesandbox/sandpack/issues/383
  const sortedDecorators = computed(() => {
    const prevDecorators = props.decorators ? [...props.decorators] : [];
    return prevDecorators
      ? prevDecorators.sort((d1, d2) => d1.line - d2.line)
      : prevDecorators;
  });

  const shouldInitEditor = ref(theInitMode.value === 'immediate');

  // @ts-ignore
  const prevExtension = ref<Extension[]>([]);
  const prevExtensionKeymap = ref<Array<readonly KeyBinding[]>>([]);

  useIntersectionObserver(
    wrapperRef,
    ([{ isIntersecting: intersecting }]) => {
      isIntersecting.value = intersecting;
    },
    {
      rootMargin: '600px 0px',
      threshold: 0.2,
    },
  );

  // ===== methods ========
  const doDelayCodeEditorInit = () => {
    if (!wrapperRef.value || !shouldInitEditor.value) return;

    resetEditor();
    timer = setTimeout(delayCodeEditorInit);
  };

  const delayCodeEditorInit = () => {
    const customCommandsKeymap: KeyBinding[] = [
      {
        key: 'Tab',
        run: insertTab,
      },
      {
        key: 'Shift-Tab',
        run: indentLess,
      },
      {
        key: 'Escape',
        run: (): boolean => {
          if (props.readOnly) return true;

          if (wrapperRef.value) {
            wrapperRef.value.focus();
          }

          return true;
        },
      },
      {
        key: 'mod-Backspace',
        run: deleteGroupBackward,
      },
    ];

    const extensionList = [
      highlightSpecialChars(),
      history(),
      closeBrackets(),

      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...commentKeymap,
        ...customCommandsKeymap,
        ...props.extensionsKeymap as (readonly KeyBinding[])[],
      ] as KeyBinding[]),
      langSupport,

      defaultHighlightStyle.fallback,

      getEditorTheme(),
      highlightTheme,
      ...props.extensions as Extension[],
    ];

    if (props.readOnly) {
      extensionList.push(EditorState.readOnly.of(true));
      extensionList.push(EditorView.editable.of(false));
    } else {
      extensionList.push(bracketMatching());
      extensionList.push(highlightActiveLine());
    }

    if (sortedDecorators.value) {
      extensionList.push(highlightDecorators(sortedDecorators.value));
    }

    if (props.wrapContent) {
      extensionList.push(EditorView.lineWrapping);
    }

    if (props.showLineNumbers) {
      extensionList.push(lineNumbers());
    }

    if (props.showInlineErrors) {
      extensionList.push(highlightInlineError());
    }

    const startState = EditorState.create({
      doc: props.code,
      extensions: extensionList,
    });

    const parentDiv = wrapperRef.value as HTMLDivElement;
    const existingPlaceholder = parentDiv.querySelector(
      '.sp-pre-placeholder',
    );
    if (existingPlaceholder) {
      parentDiv.removeChild(existingPlaceholder);
    }

    const view = new EditorView({
      state: startState,
      parent: parentDiv,
      dispatch: (tr): void => {
        view.update([tr]);

        if (tr.docChanged) {
          const newCode = tr.newDoc.sliceString(0, tr.newDoc.length);
          internalCode.value = newCode;
          props.onCodeUpdate?.(newCode);
        }
      },
    });

    view.contentDOM.setAttribute('data-gramm', 'false');

    if (!props.readOnly) {
      const attrVal = 'exit-instructions-' + ariaId.value;
      view.contentDOM.setAttribute('tabIndex', '-1');
      view.contentDOM.setAttribute('aria-describedby', attrVal);
    } else {
      view.contentDOM.classList.add('cm-readonly');
    }

    cmView.value = view;
  };

  const resetEditor = () => {
    cmView.value?.destroy();
    if (timer) {
      clearTimeout(timer);
    }
  };

  // ===== effects ========
  watch([
    () => props.readOnly,
    () => props.showLineNumbers,
    () => props.wrapContent,
    () => props.readOnly,
    () => sandpackTheme.id,
    shouldInitEditor,
    sortedDecorators,
  ], doDelayCodeEditorInit, { immediate: true });

  watch([
    () => props.initMode,
    isIntersecting,
  ], () => {
    const mode = theInitMode.value === 'lazy' || theInitMode.value === 'user-visible';

    if (mode && isIntersecting.value) {
      shouldInitEditor.value = true;
    }
  });

  watch([
    () => props.extensions,
    () => props.extensionsKeymap,
  ], () => {
    const view = cmView.value;

    const dependenciesAreDiff =
      !shallowEqual(props.extensions as Extension[], prevExtension.value) ||
      !shallowEqual(props.extensionsKeymap as (readonly KeyBinding[])[], prevExtensionKeymap.value);

    if (view && dependenciesAreDiff) {
      view.dispatch({
        effects: StateEffect.appendConfig.of(props.extensions || []),
      });

      view.dispatch({
        effects: StateEffect.appendConfig.of(
          keymap.of([...props.extensionsKeymap || []] as unknown as KeyBinding[]),
        ),
      });

      prevExtension.value = props.extensions as Extension[];
      prevExtensionKeymap.value = props.extensionsKeymap as (readonly KeyBinding[])[];
    }
  }, { immediate: true });

  // ===== life circles ========
  onMounted(() => {
    nextTick(doDelayCodeEditorInit);
  });

  onUnmounted(resetEditor);

  // ===== return ========
  return {
    internalCode,
    shouldInitEditor,
    wrapperRef,
    cmView,
    ariaId,
    languageExtension,
    syntaxHighlightRender,
  };
}
