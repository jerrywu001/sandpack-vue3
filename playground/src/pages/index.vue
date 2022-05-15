<script setup lang="ts">
import { ref } from 'vue';
import {
  Sandpack,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPredefinedTheme,
  SandpackTranspiledCode,
  SandpackProvider,
  SandpackCodeEditor,
} from '@codesandbox/sandpack-vue3';

const template = ref<SandpackPredefinedTemplate>('vue3');
const theme = ref<SandpackPredefinedTheme>('light');
const enableClose = ref(false);
const showLineNumbers = ref(true);
const wrapContent = ref(true);
const readOnly = ref(false);

const toggleTheme = () => {
  theme.value = theme.value !== 'github-light' ? 'github-light' : 'light';
};

const toggleTemplate = () => {
  template.value = template.value !== 'vue3' ? 'vue3' : 'vue';
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
    <div py2 px6>
      <button class="mybtn" @click="toggleTemplate">toggle template</button>
      <button class="mybtn" @click="toggleTheme">toggle theme</button>
      <button class="mybtn" @click="toggleWrapContent">toggle wrap content</button>
      <button class="mybtn" @click="toggleLineNumbers">toggle line numbers</button>
      <button class="mybtn" @click="toggleReadOnly">toggle readOnly</button>
      <button class="mybtn" @click="toggleClosable">toggle closable</button>
    </div>
    <Sandpack
      :theme="theme"
      :template="template"
      :options="{
        autorun: true,
        showTabs: true,
        showLineNumbers: showLineNumbers,
        closableTabs: enableClose,
        showReadOnly: true,
        readOnly: readOnly,
        wrapContent: wrapContent,
      }"
    />

    <br>
    <br>

    <SandpackProvider template="react">
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackTranspiledCode />
      </SandpackLayout>
    </SandpackProvider>
  </div>
</template>

<style lang="scss">
.mybtn {
  @apply rounded-md border border-light-50 mr-5 p-2 bg-green-500 text-xs text-white;
}
</style>
