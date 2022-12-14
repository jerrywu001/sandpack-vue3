import { Sandpack } from 'sandpack-vue3';

export default {
  title: 'Props/activeFile',
};

const mainCode = `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
`;

const appCode = `<script setup lang="ts">
import { ref } from 'vue';

const msg = ref<string>('world');
</script>

<template>
  <h1>Hello {{ msg }}</h1>
</template>`;

export const DefaultDemo = () => (
  <Sandpack
    template="vue3-ts"
    options={{ showTabs: true }}
  />
);

export const FilesActiveOption = () => (
  <Sandpack
    template="vue3-ts"
    files={{
      '/src/main.ts': {
        code: mainCode,
        active: true,
      },
      '/src/App.vue': {
        code: appCode,
      },
    }}
  />
);

export const ActiveFileOption = () => (
  <Sandpack
    template="vue3-ts"
    options={{
      showTabs: true,
      activeFile: '/src/main.ts',
    }}
  />
);

export const BothAbove = () => (
  <Sandpack
    template="vue3-ts"
    files={{
      '/src/main.ts': {
        code: mainCode,
      },
      '/src/App.vue': {
        code: appCode,
        active: true,
      },
    }}
    options={{
      showTabs: true,
      activeFile: '/src/main.ts',
    }}
  />
);
