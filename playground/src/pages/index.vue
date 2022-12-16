<script setup lang="ts">
import isEqual from 'lodash.isequal';
import { ref } from 'vue';
import { githubLight, aquaBlue } from '@codesandbox/sandpack-themes';
import {
  // Sandpack,
  // SandpackLayout,
  // SandpackTranspiledCode,
  // SandpackProvider,
  // SandpackCodeEditor,
  SandpackPredefinedTemplate,
  SandpackTheme,
} from 'sandpack-vue3';

const template = ref<SandpackPredefinedTemplate>('react');
const theme = ref<SandpackTheme>(aquaBlue);
const enableClose = ref(false);
const showLineNumbers = ref(true);
const wrapContent = ref(true);
const readOnly = ref(false);

const toggleTheme = () => {
  theme.value = isEqual(theme.value, githubLight) ? aquaBlue : githubLight;
};

const toggleTemplate = () => {
  template.value = template.value !== 'vue3' ? 'vue3' : 'react';
};

const toggleLineNumbers = () => {
  showLineNumbers.value = !showLineNumbers.value;
};

const toggleClosable = () => {
  enableClose.value = !enableClose.value;
};

const toggleWrapContent = () => {
  wrapContent.value = !wrapContent.value;
};

const toggleReadOnly = () => {
  readOnly.value = !readOnly.value;
};
</script>

<template>
  <div>
    <div>
      <button class="mybtn" @click="toggleTemplate">toggle template</button>
      <button class="mybtn" @click="toggleTheme">toggle theme</button>
      <button class="mybtn" @click="toggleWrapContent">toggle wrap content</button>
      <button class="mybtn" @click="toggleLineNumbers">toggle line numbers</button>
      <button class="mybtn" @click="toggleReadOnly">toggle readOnly</button>
      <button class="mybtn" @click="toggleClosable">toggle closable</button>
    </div>

    <Sandpack :options="{ editorHeight: 220, editorWidthPercentage: 30 }" />

    <br>
    <br>

    <Sandpack :options="{ showConsoleButton: true }" />

    <br>
    <br>

    <Sandpack
      :theme="theme"
      :template="template"
      :files="{
        '/test.js': '// test',
      }"
      :rtl="true"
      :options="{
        autorun: true,
        showTabs: true,
        showLineNumbers: showLineNumbers,
        closableTabs: enableClose,
        showReadOnly: true,
        readOnly: readOnly,
        wrapContent: wrapContent,
        editorHeight: 280,
        editorWidthPercentage: 40,
        showConsoleButton: true,
      }"
    />

    <br>
    <br>

    <hr>

    <br>
    <br>

    <SandpackProvider template="react">
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackTranspiledCode />
      </SandpackLayout>
    </SandpackProvider>

    <br>
    <br>

    <Sandpack template="test-ts" />

    <br>
    <br>

    <Sandpack
      template="vue3"
      :files="{
        '/src/main.js': {
          code: `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`,
          readOnly: true,
        },
      }"
      :options="{
        showTabs: true,
        visibleFiles: ['/src/App.vue', '/src/main.js', '/public/index.html'],
        activeFile: '/src/main.js',
        showConsoleButton: true,
        showConsole: false,
      }"
    />
  </div>
</template>

<style lang="postcss">
.mybtn {
  @apply rounded-md border border-light-50 mr-5 p-2 bg-green-500 text-xs text-white;
}
</style>
