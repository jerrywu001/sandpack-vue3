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

  return codeElementsRender;
};
