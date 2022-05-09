import { SandpackProvider } from '@codesandbox/sandpack-vue3';
import { computed, defineComponent, ref } from 'vue';
import { CustomOpenInCSB, CustomRefreshButton } from './Common';
import { CustomPreview } from './CustomPreview';

const code1 = `import React from 'react'

function Kitten() {
  return (
    <img
      src="https://placekitten.com/200/200"
      alt="Kitten"
    />
  )
}

export default function KittenGallery() {
  return (
    <section>
      <h1>A Gallery of Adorable Kittens</h1>
      <Kitten />
      <Kitten />
      <Kitten />
    </section>
  );
}`;

const code2 = `import React from 'react'

export default function KittenGallery() {
  return (
    <img
      src="https://placekitten.com/200/200"
      alt="Kitten"
    />
  )
}`;

export const JustIframeStory = defineComponent({
  name: 'JustIframeStory',
  inheritAttrs: true,
  setup() {
    const first = ref(true);
    const code = computed(() => first.value ? code1 : code2); // TODO: Switch not reactive

    return () => (
      <SandpackProvider
        customSetup={{
          files: {
            '/App.js': code.value,
          },
        }}
        template="react"
      >
        <CustomPreview />
        <div
          style={{
            display: 'flex',
            width: '400px',
            margin: '8px 0',
            justifyContent: 'space-between',
          }}
        >
          <CustomRefreshButton />
          <button onClick={() => { first.value = !first.value; }} type="button">
            Switch
          </button>
          <CustomOpenInCSB />
        </div>
      </SandpackProvider>
    );
  },
});
