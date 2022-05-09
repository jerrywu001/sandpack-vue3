import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-vue3';
import { computed, defineComponent, ref } from 'vue';

export const MultiplePreviewsStory = defineComponent({ // TODO: not render after add
  name: 'MultiplePreviewsStory',
  inheritAttrs: true,
  setup() {
    const count = ref(2);

    const previews = computed(() => Array.from(Array(count.value).keys()));

    return () => (
      <>
        <SandpackProvider>
          <SandpackLayout>
            <SandpackCodeEditor />
            {previews.value.map((pr) => (
              <SandpackPreview key={pr} />
            ))}
          </SandpackLayout>
        </SandpackProvider>
        <button onClick={() => { count.value += 1; }}>Add</button>
        <button onClick={() => { count.value -= 1; }}>Remove</button>
      </>
    );
  },
});
