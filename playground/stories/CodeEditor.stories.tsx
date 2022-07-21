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
import { ref } from 'vue';
import { aquaBlue, sandpackDark } from '@codesandbox/sandpack-themes';
import isEqual from 'lodash.isequal';

export default {
  title: 'components/Code Editor',
  component: SandpackCodeEditor,
};

export const SwitchTheme = () => {
  const theme = ref(aquaBlue);

  const switchTheme = () => {
    theme.value = isEqual(theme.value, aquaBlue) ? sandpackDark : aquaBlue;
  };

  return () => (
    <>
      <Sandpack
        theme={theme.value}
      />
      <button onClick={switchTheme}>switch theme</button>
    </>
  );
};

export const Component: Story<CodeEditorProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
    }}
    files={{
      '/index.js': {
        code: 'const title = "This is a simple code editor"',
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ShowTabs: Story<CodeEditorProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
    }}
    files={{
      '/index.js': {
        code: 'const title = "This is a simple code editor"',
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor showTabs {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const InlineError = () => (
  <SandpackProvider
    files={{
      '/App.js': `export default function App()
  return <h1>Hello World</h1>
}`,
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
  <SandpackProvider
    files={{
      '/App.js': `export default function App()
  return <h1>Hello World</h1>
  }`,
      '/test.js': `export default function App()
return <h1>test</h1>
}`,
    }}
    template="react"
  >
    <SandpackThemeProvider theme="dark">
      <SandpackCodeEditor closableTabs />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ExtensionAutocomplete = () => {
  const active = ref(false);

  return () => (
    <>
      <button onClick={() => { active.value = !active.value; }}>
        Toggle ({ active.value ? 'on' : 'off' })
      </button>
      <SandpackProvider template="react">
        <SandpackThemeProvider>
          <SandpackCodeEditor
            extensions={active.value ? [autocompletion()] : []}
            // @ts-ignore
            extensionsKeymap={active.value ? [completionKeymap] : []}
            id="extensions"
          />
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  );
};

export const ReadOnly = () => (
  <>
    <p>1. Read-only by file</p>
    <Sandpack
      customSetup={{ entry: '/index.tsx' }}
      files={{
        '/index.tsx': { code: '', hidden: true },
        '/App.tsx': { code: 'Hello', readOnly: true, active: true },
        '/src/components/button.tsx': { code: 'World', readOnly: false },
      }}
      options={{ showTabs: true, activeFile: '/App.tsx' }}
      template="react-ts"
    />

    <p>2. Read-only global</p>
    <Sandpack
      options={{ showTabs: true, readOnly: true }}
      template="react-ts"
    />

    <p>3. Read-only global and by file</p>
    <Sandpack
      files={{
        '/index.tsx': { code: '', hidden: true },
        '/src/App.tsx': { code: '// showTabs: false', readOnly: true },
        '/src/components/button.tsx': { code: 'World', readOnly: false },
      }}
      options={{ showTabs: false, readOnly: true }}
      template="react-ts"
    />

    <p>4. Read-only global, but no label</p>
    <Sandpack
      files={{
        '/index.tsx': { code: '', hidden: true },
        '/src/App.tsx': { code: '// showTabs: false', readOnly: true },
        '/src/components/button.tsx': { code: 'World', readOnly: false },
      }}
      options={{ showTabs: false, readOnly: true, showReadOnly: false }}
      template="react-ts"
    />

    <p>5. Read-only by file, but no label</p>
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
