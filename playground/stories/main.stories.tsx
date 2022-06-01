import { Sandpack } from 'codesandbox-sandpack-vue3';

export default {
  title: 'Intro/Playground',
};

export const Main = () => (
  <>
    <Sandpack
      template="vue3"
      files={{
        '/src/main.js': {
          code: `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
          `,
          readOnly: true,
        },
      }}
      options={{
        showTabs: true,
        visibleFiles: ['/src/App.vue', '/src/main.js', '/public/index.html'],
        activeFile: '/src/main.js',
      }}
    />
  </>
);
