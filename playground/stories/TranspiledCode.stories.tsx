import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
  SandpackTranspiledCode,
} from 'sandpack-vue3';

export default {
  title: 'components/Transpiled Code View',
};

export const Component = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      dependencies: { '@babel/runtime': 'latest' },
    }}
    files={{
      '/index.js': {
        code: `const text = 'Hello world!'
const str = \`<div>\${text}</div>\`
`,
      },
    }}
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackTranspiledCode />
    </SandpackLayout>
  </SandpackProvider>
);
