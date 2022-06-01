import { FileTabs, SandpackCodeViewer, SandpackLayout, SandpackProvider } from 'codesandbox-sandpack-vue3';

export default {
  title: 'components/File Tabs',
};

export const Component = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
    }}
    files={{
      '/index.tsx': '',
      '/src/app.tsx': { code: '', active: true },
      '/src/components/button.tsx': '',
    }}
  >
    <SandpackLayout>
      <FileTabs />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithClosableTabs = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
    }}
    files={{
      '/index.tsx': { code: '', hidden: true },
      '/src/app.tsx': 'Hello',
      '/src/components/button.tsx': 'World',
    }}
  >
    <SandpackLayout>
      <FileTabs closableTabs />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithHiddenFiles = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
    }}
    files={{
      '/index.tsx': { code: '', hidden: true },
      '/src/app.tsx': 'Hello',
      '/src/components/button.tsx': 'World',
    }}
  >
    <SandpackLayout>
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);
