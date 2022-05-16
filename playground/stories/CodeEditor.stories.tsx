import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import {
  CodeEditorProps,
  Sandpack,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from 'codesandbox-sandpack-vue3';
import { Story } from '@storybook/vue3';

export default {
  title: 'components/Code Editor',
  component: SandpackCodeEditor,
};

export const Component: Story<CodeEditorProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      files: {
        '/index.js': {
          code: 'const title = "This is a simple code editor"',
        },
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const InlineError = () => (
  <SandpackProvider
    customSetup={{
      files: {
        '/App.js': `export default function App()
  return <h1>Hello World</h1>
}
`,
      },
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor showInlineErrors showLineNumbers />
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ClosableTabs = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider theme="dark">
      <SandpackCodeEditor closableTabs />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ExtensionAutocomplete = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor
        extensions={[autocompletion()]}
        extensionsKeymap={[completionKeymap]}
        id="extensions"
      />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReadOnly = () => (
    <>
      <p>Read-only by file</p>
      <Sandpack
        customSetup={{ entry: '/index.tsx', main: '/App.tsx' }}
        files={{
          '/index.tsx': { code: '', hidden: true },
          '/src/App.tsx': { code: 'Hello', readOnly: true, active: true },
          '/src/components/button.tsx': { code: 'World', readOnly: false },
        }}
        options={{ showTabs: true }}
        template="react-ts"
      />

      <p>Read-only global</p>
      <Sandpack
        options={{ showTabs: true, readOnly: true }}
        template="react-ts"
      />

      <p>Read-only global and by file</p>
      <Sandpack
        files={{
          '/index.tsx': { code: '', hidden: true },
          '/src/App.tsx': { code: 'Hello', readOnly: true },
          '/src/components/button.tsx': { code: 'World', readOnly: false },
        }}
        options={{ showTabs: false, readOnly: true }}
        template="react-ts"
      />

      <p>Read-only global, but no label</p>
      <Sandpack
        files={{
          '/index.tsx': { code: '', hidden: true },
          '/src/App.tsx': { code: 'Hello', readOnly: true },
          '/src/components/button.tsx': { code: 'World', readOnly: false },
        }}
        options={{ showTabs: false, readOnly: true, showReadOnly: false }}
        template="react-ts"
      />

      <p>Read-only by file, but no label</p>
      <Sandpack
        files={{
          '/index.tsx': { code: '', hidden: true },
          '/src/App.tsx': { code: 'Hello', readOnly: true, active: true },
          '/src/components/button.tsx': { code: 'World', readOnly: false },
        }}
        options={{ showTabs: true, readOnly: false, showReadOnly: false }}
        template="react-ts"
      />
    </>
);