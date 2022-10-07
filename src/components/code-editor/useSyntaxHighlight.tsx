import type { HighlightStyle } from '@codemirror/highlight';
import { highlightTree } from '@codemirror/highlight';
import type { LanguageSupport } from '@codemirror/language';

export const useSyntaxHighlight = ({
  langSupport,
  highlightTheme,
  code = '',
}: {
  langSupport: LanguageSupport;
  highlightTheme: HighlightStyle;
  code?: string;
}): (JSX.Element | string)[] => {
  const tree = langSupport.language.parser.parse(code);

  let offSet = 0;
  const codeElementsRender = [] as (JSX.Element | string)[];

  const addElement = (to: number, className: string): void => {
    if (to > offSet) {
      const children = code.slice(offSet, to);

      codeElementsRender.push(
        className ? (
          <span key={`${to}${offSet}`} class={className}>
            { children }
          </span>
        ) : children,
      );

      offSet = to;
    }
  };

  highlightTree(tree, highlightTheme.match, (from, to, className) => {
    addElement(from, '');
    addElement(to, className);
  });

  /**
   * The language parse doesn't look consistent.
   * The final syntax highlight used by CodeMirror
   * includes an end empty line, and the parse here doesn't,
   * so let's add it manually.
   */
  if (offSet < code.length) {
    codeElementsRender.push('\n\n');
  }

  return codeElementsRender;
};
