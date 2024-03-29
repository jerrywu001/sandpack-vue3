import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from 'sandpack-vue3';
import { computed, defineComponent, ref, StyleValue } from 'vue';
import { SandpackListener } from './SandpackListener';

export const MultiplePreviewsAndListenersStory = defineComponent({
  name: 'MultiplePreviewsAndListenersStory',
  inheritAttrs: true,
  setup() {
    const count = ref(2);
    const listenersCount = ref(0);

    const previews = computed(() => Array.from(Array(count.value).keys()));

    return () => (
      <>
        <SandpackProvider template="react">
          {new Array(listenersCount.value).fill(' ').map((pr) => (
            <SandpackListener key={pr} />
          ))}
          <SandpackLayout>
            <SandpackCodeEditor />
            {previews.value.map((pr) => (
              <SandpackPreview key={pr} style={{ minWidth: '320px' } as StyleValue} />
            ))}
          </SandpackLayout>
        </SandpackProvider>
        <button onClick={() => { count.value += 1; }}>Add</button>
        {
          previews.value.length > 1 && (
            <button onClick={() => { count.value -= 1; }}>Remove</button>
          )
        }

        <p>Amount of listeners: {listenersCount.value}</p>
        <button onClick={() => { listenersCount.value += 1; }}>
          Add listener
        </button>
        {
          listenersCount.value > 0 && (
            <button onClick={() => { listenersCount.value -= 1; }}>
              Remove listener
            </button>
          )
        }
      </>
    );
  },
});
