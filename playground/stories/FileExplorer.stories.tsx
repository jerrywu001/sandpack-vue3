import {
  Directory,
  File,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
  SandpackPreview,
} from 'codesandbox-sandpack-vue3';

export default {
  title: 'components/File Explorer',
};

export const Component = () => (
  <>
    <SandpackProvider
      customSetup={{
        entry: '/index.tsx',
      }}
      files={{
        '/index.tsx': '',
        '/src/app.tsx': '',
        '/src/components/button.tsx': '',
      }}
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider
      customSetup={{
        entry: '/index.tsx',
      }}
      files={{
        '/index.tsx': 'index',
        '/src/app.tsx': 'app',
        '/src/components/button.tsx': 'button',
      }}
      theme="dark"
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider template="react">
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
        <SandpackPreview />
      </SandpackLayout>
  </SandpackProvider>
  </>
);

export const LongFileTree = () => (
  <SandpackProvider
    customSetup={{
      entry: '/src/com0.js',
    }}
    files={new Array(20).fill(' ').reduce((acc, _curr, index) => {
      acc[`/src/com${index}.js`] = '';

      return acc;
    }, {})}
  >
    <SandpackLayout>
      <SandpackFileExplorer />
    </SandpackLayout>
  </SandpackProvider>
);

export const FileStory = () => (
  <SandpackProvider>
    <SandpackLayout>
      <File depth={1} path="file.ts" />
    </SandpackLayout>
  </SandpackProvider>
);

export const DirectoryIconStory = () => (
  <SandpackProvider>
    <SandpackLayout>
      <Directory
        activeFile="file.ts"
        depth={1}
        files={{ App: { code: 'app' } }}
        prefixedPath="/src"
        selectFile={(): any => null}
      />
    </SandpackLayout>
  </SandpackProvider>
);
