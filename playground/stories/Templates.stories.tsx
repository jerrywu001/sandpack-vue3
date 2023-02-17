import { SANDBOX_TEMPLATES } from 'sandpack-vue3/templates';
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
} from 'sandpack-vue3';
import { storiesOf } from '@storybook/vue3';

const stories = storiesOf('presets/Template', module);

Object.keys(SANDBOX_TEMPLATES).forEach((template) => stories.add(template, () => {
  const isNode = SANDBOX_TEMPLATES[template].environment === 'node';

  return (
      <SandpackProvider
        options={{
          bundlerTimeOut: 90000,
          bundlerURL: isNode
            ? undefined
            : 'https://1-17-1-sandpack.codesandbox.io/',
        }}
        template={template as SandpackPredefinedTemplate}
      >
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs showLineNumbers />
          <SandpackPreview showNavigator />
        </SandpackLayout>
        <br />
        <SandpackLayout>
          <SandpackConsole />
        </SandpackLayout>
      </SandpackProvider>
  );
}));
