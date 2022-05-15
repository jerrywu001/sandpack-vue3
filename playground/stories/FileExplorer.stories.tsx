import {
  Directory,
  File,
  FileExplorer,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from 'codesandbox-sandpack-vue3';

export default {
  title: 'components/File Explorer',
};

export const Component = () => (
  <>
    <SandpackProvider
      customSetup={{
        entry: '/index.tsx',
        files: {
          '/index.tsx': 'index',
          '/src/app.tsx': 'app',
          '/src/components/button.tsx': 'button',
        },
      }}
    >
      <SandpackLayout>
        <FileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider
      customSetup={{
        entry: '/index.tsx',
        files: {
          '/index.tsx': 'index',
          '/src/app.tsx': 'app',
          '/src/components/button.tsx': 'button',
        },
      }}
    >
      <SandpackLayout theme="night-owl">
        <FileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  </>
);

export const LongFileTree = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
      files: new Array(20).fill(' ').reduce((acc, _curr, index) => {
        acc[`/src/com${index}.js`] = `${index}`;

        return acc;
      }, {}),
    }}
  >
    <SandpackLayout>
      <FileExplorer />
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
        activePath="file.ts"
        depth={1}
        files={{ App: { code: 'app' } }}
        prefixedPath="/src"
        selectFile={(): any => null}
      />
    </SandpackLayout>
  </SandpackProvider>
);
