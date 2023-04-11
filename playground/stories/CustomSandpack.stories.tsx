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
  RefreshIcon,
  RoundedButton,
  Sandpack,
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  SandpackThemeProvider,
  SandpackTranspiledCode,
  stackClassName,
} from 'sandpack-vue3';

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
      <SandpackCodeEditor />
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);

/** UsingVisualElements */
export const UsingVisualElements = () => (
  <SandpackProvider options={{ activeFile: '/App.js' }} template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor
        style={{
          width: '500px',
          height: '300px',
        }}
      />

      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{
          border: '1px solid red',
          marginBottom: '4px',
          marginTop: '4px',
          width: '500px',
          height: '300px',
        }}
      />

      <div
        style={{
          display: 'flex',
          width: '500px',
          justifyContent: 'space-between',
        }}
      >
        <OpenInCodeSandboxButton />
        <RoundedButton>
          <RefreshIcon />
        </RoundedButton>
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
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{ border: '1px solid red', width: '400px', height: '300px' }}
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

/** ClosableTabs */
export const ClosableTabs = () => (
  <Sandpack
    options={{ closableTabs: true, visibleFiles: ['/App.js', '/index.js'] }}
    template="react"
  />
);

/** ResetButton */
export const ResetButton = () => (
  <>
    <SandpackProvider files={{ '/test.js': '// test' }} template="react">
      <SandpackLayout>
        <div
          class={stackClassName.toString()}
          style={{ position: 'relative', width: '100%' }}
        >
          <SandpackCodeEditor closableTabs />
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
          class={stackClassName.toString()}
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
    files={{
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

export const CustomNpmRegistries = () => (
  <Sandpack
    customSetup={{
      dependencies: { '@codesandbox/test-package': '1.0.5' },
      npmRegistries: [
        {
          enabledScopes: ['@codesandbox'],
          limitToScopes: true,
          registryUrl: 'https://xywctu-4000.preview.csb.app',
        },
      ],
    }}
    files={{
      '/App.js': `import { Button } from "@codesandbox/test-package"
export default function App() {
  return (
    <div>
      <Button>I'm a private Package</Button>
    </div>
  )
}
`,
    }}
    template="react"
  />
);

export const HiddenHeadTags = () => {
  const files = {
    'hidden-test.js': `
function alertTest() {
  alert('Hidden Script Test');
}
`,
    'hidden-test-1.css': `
body {
  background-color: red;
}
`,
    'hidden-test-2.css': `
body {
  background-color: blue;
}
`,
    'index.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="flex items-center justify-center">
  <button class="p-4 bg-white rounded" onClick="alertTest()">Alert</button>
</body>
</html>
`,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div>Sandpack Component</div>
        <Sandpack
          files={files}
          template="static"
          options={{
            externalResources: [
              'https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css',
              '/hidden-test.js',
              '/hidden-test-1.css',
              '/hidden-test-2.css',
            ],
          }}
        />
      </div>
      <div>
        <div>Sandpack Provider Component</div>
        <SandpackProvider
          files={files}
          options={{
            externalResources: [
              'https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css',
              '/hidden-test.js',
              '/hidden-test-1.css',
              '/hidden-test-2.css',
            ],
          }}
          template="static"
        >
          <SandpackLayout>
            <SandpackFileExplorer />
            <SandpackCodeEditor closableTabs showLineNumbers />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};
