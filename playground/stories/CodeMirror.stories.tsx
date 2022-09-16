/* eslint-disable max-len */
import { CodeEditor, SandpackProvider } from 'codesandbox-sandpack-vue3';
import * as mocks from 'codesandbox-sandpack-vue3/components/code-editor/languages-mocks';
import { python } from '@codemirror/lang-python';
import { LanguageSupport } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { StreamLanguage } from '@codemirror/stream-parser';

export default {
  title: 'components/CodeMirror',
  component: CodeEditor,
};

export const HTML = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.html}
      fileType="html"
      id="html"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const Javascript = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.js}
      fileType="js"
      id="js"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const JSX = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.jsx}
      fileType="jsx"
      id="jsx"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const CSS = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.css}
      fileType="css"
      id="css"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const Less = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.less}
      fileType="less"
      id="less"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const Vue = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.vue}
      fileType="vue"
      id="vue"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const Markdown = () => (
  <SandpackProvider>
    <CodeEditor
      code={mocks.markdown}
      fileType="markdown"
      id="markdown"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const CustomLanguageShell = () => (
  <SandpackProvider>
    <CodeEditor
      additionalLanguages={[
        {
          name: 'shell',
          extensions: ['sh'],
          language: new LanguageSupport(StreamLanguage.define(shell)),
        },
      ]}
      code={mocks.shell}
      filePath="example.sh"
      id="shell"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const CustomLanguagePython = () => (
  <SandpackProvider>
    <CodeEditor
      additionalLanguages={[
        {
          name: 'python',
          extensions: ['py'],
          language: python(),
        },
      ]}
      code={mocks.python}
      fileType="python"
      id="python"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const ShowLineNumber = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
@width: 10px;
@height: @width + 10px;
#header {
  width: @width;
  height: @height;
}
`}
      fileType="less"
      id="less"
      initMode="immediate"
      showLineNumbers
    />
  </SandpackProvider>
);

export const WrapContent = () => (
  <SandpackProvider>
    <CodeEditor
      code={Array(20).fill('Lorem ipsum').join('')}
      id="wrap"
      initMode="immediate"
      showLineNumbers
      wrapContent
    />
  </SandpackProvider>
);

export const Decorators = () => (
  <SandpackProvider>
    <style>
      {`.highlight, .widget {
        background: red;
      }`}
    </style>
    <CodeEditor
      code={`const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];
export default function List() {
  const [text, setText] = useState("")
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}`}
      decorators={[
        { className: 'highlight', line: 1 },
        { className: 'highlight', line: 9 },
        {
          className: 'widget',
          elementAttributes: { 'data-id': '2' },
          line: 13,
          startColumn: 8,
          endColumn: 17,
        },
        {
          className: 'widget',
          elementAttributes: { 'data-id': '1' },
          line: 12,
          startColumn: 26,
          endColumn: 38,
        },
      ]}
      fileType="jsx"
      id="decorators"
      initMode="immediate"
    />
  </SandpackProvider>
);
