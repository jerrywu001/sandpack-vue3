import * as allThemes from '@codesandbox/sandpack-themes';
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from 'sandpack-vue3';
import { storiesOf } from '@storybook/vue3';

const stories = storiesOf('presets/Themes (external)', module);

Object.entries(allThemes).forEach(([themeName, value]) => stories.add(themeName, () => (
  <>
    <Sandpack
      options={{
        showLineNumbers: true,
        showInlineErrors: true,
        showNavigator: true,
        showTabs: true,
      }}
      template="react"
      theme={value}
    />

    <SandpackProvider template="react" theme={value}>
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor showLineNumbers showTabs />
        <SandpackPreview showNavigator />
      </SandpackLayout>
    </SandpackProvider>
  </>
)));
