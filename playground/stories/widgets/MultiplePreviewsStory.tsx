import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from 'sandpack-vue3';
import { computed, defineComponent, ref, type StyleValue } from 'vue';

export const MultiplePreviewsStory = defineComponent({
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
              <SandpackPreview key={pr} style={{ minWidth: '320px' } as StyleValue} />
            ))}
          </SandpackLayout>
        </SandpackProvider>
        <button onClick={() => { count.value += 1; }}>Add</button>
        {
          previews.value.length > 1 && <button onClick={() => { count.value -= 1; }}>Remove</button>
        }
      </>
    );
  },
});
