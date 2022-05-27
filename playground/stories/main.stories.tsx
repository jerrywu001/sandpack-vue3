import { Sandpack } from 'codesandbox-sandpack-vue3';

export default {
  title: 'Intro/Playground',
};

export const Main = (): JSX.Element => (
  <Sandpack
      files={{
        './baz': {
          code: 'const a = 1;',
        },
      }}
      options={{
        // @ts-ignore
        activeFile: './baz',
        visibleFiles: ['./baz', '/src/App.vue'],
      }}
      template="vue"
    />
);
