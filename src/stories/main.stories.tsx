import * as themes from '@codesandbox/sandpack-themes';
import {
  CodeEditorProps,
  SANDBOX_TEMPLATES,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProp,
} from 'codesandbox-sandpack-vue3';
import { computed, ComputedRef, reactive } from 'vue';

export default {
  title: 'Intro/Playground',
};

export const Main = () => {
  const config = reactive({
    Components: { Preview: true, Editor: true, FileExplorer: true },
    Options: {
      showTabs: true,
      showLineNumbers: true,
      showInlineErrors: true,
      closableTabs: true,
      wrapContent: true,
      readOnly: false,
      showReadOnly: true,
      showNavigator: true,
      showRefreshButton: true,
    },
    Template: 'react',
    Theme: 'auto' as SandpackThemeProp,
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
                  <h3>Themes</h3>
                  <select
                    // @ts-ignore
                    onChange={({ target }): void => update('Template', target?.value)
                    }
                    value={config.Template}
                  >
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
        template={config.Template as SandpackPredefinedTemplate}
        // @ts-ignore
        theme={themes[config.Theme] || config.Theme}
      >
        <SandpackLayout>
          {config.Components.FileExplorer && <SandpackFileExplorer />}
          {config.Components.Editor && (
            <SandpackCodeEditor { ...codeEditorOptions.value } />
          )}
          {config.Components.Preview && (
            <SandpackPreview
              showNavigator={config.Options?.showNavigator}
              showRefreshButton={config.Options?.showRefreshButton}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};
