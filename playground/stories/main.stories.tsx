import * as themes from '@codesandbox/sandpack-themes';
import {
  CodeEditorProps,
  SANDBOX_TEMPLATES,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackTests,
  SandpackPreview,
  SandpackProvider,
  SandpackConsole,
} from 'codesandbox-sandpack-vue3';
import { computed, ComputedRef, reactive } from 'vue';

export default {
  title: 'Intro/Playground',
};

export const Main = () => {
  const config = reactive({
    Components: { Preview: true, Editor: true, FileExplorer: true, Console: true, Tests: true },
    Options: {
      showTabs: true,
      showLineNumbers: true,
      showInlineErrors: true,
      closableTabs: true,
      wrapContent: false,
      readOnly: false,
      showReadOnly: true,
      showNavigator: true,
      showRefreshButton: true,
      consoleShowHeader: true,
    },
    Template: 'exhaustedFilesTests' as const,
    Theme: 'light',
  });

  const update = (key: any, value: any): void => {
    // @ts-ignore
    config[key] = value;
  };

  const toggle = (key: any, value: any): void => {
    console.log(key);
    // @ts-ignore
    config[key] = { ...config[key], [value]: !config[key][value] };
  };

  const codeEditorOptions: ComputedRef<CodeEditorProps> = computed(() => ({
    showTabs: config.Options.showTabs,
    showLineNumbers: config.Options.showLineNumbers,
    showInlineErrors: config.Options.showInlineErrors,
    wrapContent: config.Options.wrapContent,
    closableTabs: config.Options.closableTabs,
    readOnly: config.Options.readOnly,
    showReadOnly: config.Options.showReadOnly,
  }));

  return () => (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '2em', minWidth: 200 }}>
        {Object.entries(config).map(([key, value]) => {
          if (typeof value === 'string') {
            if (key === 'Template') {
              return (
                <div>
                  <h3>Template</h3>
                  <select
                    // @ts-ignore
                    onChange={({ target }): void => update('Template', target?.value)
                    }
                    value={config.Template}
                  >
                    <option value="exhaustedFilesTests">
                      exhaustedFilesTests
                    </option>
                    {Object.keys(SANDBOX_TEMPLATES).map((tem) => (
                      <option value={tem}>{tem}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (key === 'Theme') {
              return (
                <div>
                  <h3>Themes</h3>
                  <select
                    // @ts-ignore
                    onChange={({ target }): void => update('Theme', target.value)
                    }
                    value={config.Theme}
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    {Object.keys(themes).map((tem) => (
                      <option value={tem}>{tem}</option>
                    ))}
                  </select>
                </div>
              );
            }

            return value;
          }

          return (
            <>
              <h3>{key}</h3>
              {Object.entries(value).map(([prop, propValue]) => (
                  <p>
                    <label>
                      <input
                        // @ts-ignore
                        defaultChecked={!!propValue}
                        onClick={(): void => toggle(key, prop)}
                        type="checkbox"
                      />
                      {prop}
                    </label>
                  </p>
              ))}
            </>
          );
        })}
      </div>

      <SandpackProvider
        customSetup={{
          dependencies: config.Template === 'exhaustedFilesTests'
            ? exhaustedFilesTests.dependencies
            : {},
        }}
        files={
          config.Template === 'exhaustedFilesTests' ? exhaustedFilesTests.files : {}
        }
        template={
          config.Template === 'exhaustedFilesTests' ? undefined : config.Template
        }
        // @ts-ignore
        theme={themes[config.Theme] || config.Theme}
      >
        <SandpackLayout>
          <div class="playground-grid">
            {config.Components.FileExplorer && <SandpackFileExplorer />}
            {config.Components.Editor && (
              <SandpackCodeEditor {...codeEditorOptions.value} />
            )}
            {config.Components.Preview && (
              <SandpackPreview
                showNavigator={config.Options?.showNavigator}
                showRefreshButton={config.Options?.showRefreshButton}
              />
            )}

            {config.Components.Console && (
              <SandpackConsole showHeader={config.Options.consoleShowHeader} />
            )}
            {config.Components.Tests && <SandpackTests />}
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

const defaultTemplate = SANDBOX_TEMPLATES['react-ts'];

const exhaustedFilesTests = {
  ...defaultTemplate,
  dependencies: {
    ...defaultTemplate.dependencies,
    '@testing-library/react': '^13.3.0',
    '@testing-library/jest-dom': '^5.16.5',
  },
  files: {
    '/src/index.tsx': SANDBOX_TEMPLATES['react-ts'].files['/index.tsx'],
    '/src/App.tsx': `console.log("Hello world");\n\n${SANDBOX_TEMPLATES['react-ts'].files['/App.tsx'].code}`,
    '/src/App.test.tsx': `import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
test('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});`,
    '/src/styles.css': SANDBOX_TEMPLATES['react-ts'].files['/styles.css'],
    '/package.json': JSON.stringify({ main: '/src/index.tsx' }),
  },
};
