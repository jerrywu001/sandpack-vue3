import {
  CustomCodeEditor,
  CustomOpenInCSB,
  CustomRefreshButton,
  ListenerIframeMessage,
  ResetButtonComp,
  ResetCurrentFileButton,
} from './widgets/Common';
import { JustIframeStory } from './widgets/JustIframeStory';
import { MultiplePreviewsAndListenersStory } from './widgets/MultiplePreviewsAndListenersStory';
import { MultiplePreviewsStory } from './widgets/MultiplePreviewsStory';
import {
  OpenInCodeSandboxButton,
  RefreshButton,
  Sandpack,
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  SandpackThemeProvider,
  SandpackTranspiledCode,
} from '@codesandbox/sandpack-vue3';
import { MultiplePreviewsRandomViewportsStory } from './widgets/MultiplePreviewsRandomViewportsStory';

export default {
  title: 'presets/Sandpack: custom',
};

/** UsingSandpackLayout */
export const UsingSandpackLayout = () => (
  <SandpackProvider>
    <SandpackLayout>
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);

/** UsingVisualElements */
export const UsingVisualElements = () => (
  <SandpackProvider activePath="/App.js" template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor
        customStyle={{
          width: '500px',
          height: '300px',
        }}
      />

      <SandpackPreview
        customStyle={{
          border: '1px solid red',
          marginBottom: '4px',
          marginTop: '4px',
          width: '500px',
          height: '300px',
        }}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />

      <div
        style={{
          display: 'flex',
          width: '500px',
          justifyContent: 'space-between',
        }}
      >
        <OpenInCodeSandboxButton />
        <RefreshButton />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

/** UsingHooks */
export const UsingHooks = () => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <CustomCodeEditor />

      <SandpackPreview
        customStyle={{ border: '1px solid red', width: '400px', height: '300px' }}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />

      <div
        style={{
          display: 'flex',
          width: '400px',
          margin: '8px 0',
          justifyContent: 'space-between',
        }}
      >
        <CustomRefreshButton />
        <CustomOpenInCSB />
      </div>

      <div style={{ width: '400px' }}>
        <SandpackTranspiledCode />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

/** JustIframe */
const JustIframeTemplate = () => ({
  components: { JustIframeStory },
  setup() {
    return {};
  },
  template: '<JustIframeStory />',
});
export const JustIframe = JustIframeTemplate.bind({});

/** MultiplePreviews */
const MultiplePreviewsTemplate = () => ({
  components: { MultiplePreviewsStory },
  setup() {
    return {};
  },
  template: '<MultiplePreviewsStory />',
});
export const MultiplePreviews = MultiplePreviewsTemplate.bind({});

/** MultiplePreviewsAndListeners */
const MultiplePreviewsAndListenersTemplate = () => ({
  components: { MultiplePreviewsAndListenersStory },
  setup() {
    return {};
  },
  template: '<MultiplePreviewsAndListenersStory />',
});
export const MultiplePreviewsAndListeners = MultiplePreviewsAndListenersTemplate.bind({});

/** MultiplePreviewsRandomViewports */
const MultiplePreviewsRandomViewportsTemplate = () => ({
  components: { MultiplePreviewsRandomViewportsStory },
  setup() {
    return {};
  },
  template: '<MultiplePreviewsRandomViewportsStory />',
});
export const MultiplePreviewsRandomViewports = MultiplePreviewsRandomViewportsTemplate.bind({});

/** ClosableTabs */
export const ClosableTabs = () => (
  <Sandpack options={{ closableTabs: true }} template="react" />
);

/** ResetButton */
export const ResetButton = () => (
  <>
    <SandpackProvider template="react">
      <SandpackLayout>
        <div
           class="sp-stack"
          style={{ position: 'relative', width: '100%' }}
        >
          <SandpackCodeEditor />
          <ResetButtonComp />
        </div>
        <SandpackStack>
          <SandpackPreview />
        </SandpackStack>
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider template="react">
      <SandpackLayout>
        <div
           class="sp-stack"
          style={{ position: 'relative', width: '100%' }}
        >
          <SandpackCodeEditor />
          <ResetCurrentFileButton />
        </div>
        <SandpackStack>
          <SandpackPreview />
        </SandpackStack>
      </SandpackLayout>
    </SandpackProvider>
  </>
);

/** IframeMessage */
export const IframeMessage = () => (
  <SandpackProvider
    customSetup={{
      files: {
        '/App.js': `import {useState, useEffect} from "react";

export default function App() {
const [message, setMessage] = useState("")

useEffect(() => {
  window.addEventListener("message", (event) => {
    setMessage(event.data);
  });
}, [])

return <h1>{message}</h1>
}
`,
      },
    }}
    template="react"
  >
    <ListenerIframeMessage />
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
