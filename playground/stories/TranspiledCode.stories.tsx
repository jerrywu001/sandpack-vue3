import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
  SandpackStack,
  SandpackTranspiledCode,
} from '@codesandbox/sandpack-vue3';

export default {
  title: 'components/Transpiled Code View',
};

export const Component = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      files: {
        '/index.js': {
          code: `const text = 'Hello World!'
const str = \`<div>\${text}</div>\`
`,
        },
      },
      dependencies: { '@babel/runtime': 'latest' },
    }}
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
    </SandpackLayout>
  </SandpackProvider>
);
