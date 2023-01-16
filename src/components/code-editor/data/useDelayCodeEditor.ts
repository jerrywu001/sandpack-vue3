import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { syntaxHighlighting, bracketMatching } from '@codemirror/language';
import { CodeMirrorProps } from '..';
import { getFileName } from '../../../utils/stringUtils';
import { highlightDecorators } from '../highlightDecorators';
import { highlightInlineError } from '../highlightInlineError';
import { shallowEqual } from '../../../utils/array';
import { useSandpackTheme } from '../../../hooks';
import { useSyntaxHighlight } from '../useSyntaxHighlight';
import { EditorState, type Extension, StateEffect } from '@codemirror/state';
import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getLanguageFromFile,
  getSyntaxHighlight,
} from '../utils';
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
  lineNumbers,
} from '@codemirror/view';
import {
  defaultKeymap,
  indentLess,
  indentMore,
  deleteGroupBackward,
  history,
  historyKeymap,
} from '@codemirror/commands';
import { type CustomLanguage } from '../../../types';

export default function useDelayCodeEditor(props: CodeMirrorProps) {
  // ===== vars & states ========
  let timer: NodeJS.Timer;

  const sandpackTheme = useSandpackTheme();
  // const languageExtension = getLanguageFromFile(props.filePath, props.fileType);
  // const langSupport = getCodeMirrorLanguage(languageExtension);

  const languageExtension = getLanguageFromFile(
    props.filePath,
    props.fileType,
    props.additionalLanguages as CustomLanguage[],
  );
  const langSupport = getCodeMirrorLanguage(
    languageExtension,
    props.additionalLanguages as CustomLanguage[],
  );

  const highlightTheme = getSyntaxHighlight(sandpackTheme.theme);

  const syntaxHighlightRender = useSyntaxHighlight({
    langSupport,
    highlightTheme,
    code: props.code,
  });

  const internalCode = ref<string>(props.code);
  const wrapperRef = ref<HTMLDivElement>();
  const cmView = ref<EditorView>();
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
  const prevExtensionKeymap = ref<KeyBinding[]>([]);

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
        run: (view): boolean => {
          indentMore(view);

          const customKey = (props.extensionsKeymap as KeyBinding[]).find(
            ({ key }) => key === 'Tab',
          );

          return customKey?.run?.(view) ?? true;
        },
      },
      {
        key: 'Shift-Tab',
        run: ({ state, dispatch }): boolean => {
          indentLess({ state, dispatch });

          const customKey = (props.extensionsKeymap as KeyBinding[]).find(
            ({ key }) => key === 'Shift-Tab',
          );

          return customKey?.run?.(view) ?? true;
        },
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
      ...props.extensions as Extension[],
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...customCommandsKeymap,
        ...props.extensionsKeymap as KeyBinding[],
      ] as KeyBinding[]),
      langSupport,

      getEditorTheme(),
      syntaxHighlighting(highlightTheme),
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

    const parentDiv = wrapperRef.value as HTMLDivElement;
    const existingPlaceholder = parentDiv.querySelector(
      '.sp-pre-placeholder',
    );
    if (existingPlaceholder) {
      parentDiv.removeChild(existingPlaceholder);
    }

    const view = new EditorView({
      doc: props.code,
      extensions: extensionList,
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
    view.contentDOM.setAttribute(
      'aria-label',
      props.filePath ? `Code Editor for ${getFileName(props.filePath)}` : 'Code Editor',
    );

    if (!props.readOnly) {
      view.contentDOM.classList.add('cm-readonly');
    } else {
      view.contentDOM.setAttribute('tabIndex', '-1');
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
    () => props.showInlineErrors,
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
      !shallowEqual(props.extensionsKeymap as KeyBinding[], prevExtensionKeymap.value);

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
      prevExtensionKeymap.value = props.extensionsKeymap as KeyBinding[];
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
    languageExtension,
    syntaxHighlightRender,
  };
}
