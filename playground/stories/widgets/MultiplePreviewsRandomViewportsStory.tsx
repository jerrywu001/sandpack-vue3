import { Box } from './Box';
import { computed, defineComponent, ref } from 'vue';
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
  ViewportSize,
} from '@codesandbox/sandpack-vue3';
import { VIEWPORTS } from './Common';

export const MultiplePreviewsRandomViewportsStory = defineComponent({ // TODO: not render after add
  name: 'MultiplePreviewsRandomViewportsStory',
  inheritAttrs: true,
  setup() {
    const count = ref(0);

    const previews = computed(() => Array.from(Array(count.value).keys()));

    return () => (
      <>
        <button onClick={() => { count.value += 1; }}>Add</button>
        <button onClick={() => { count.value = count.value > 0 ? count.value - 1 : 0; }}>
          Remove
        </button>
        <SandpackProvider>
          <SandpackThemeProvider>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box height="400px" label="code editor" width="400px">
                <SandpackCodeEditor />
              </Box>
              {previews.value.map((pr, index) => {
                const viewport = VIEWPORTS[index % 3];
                return (
                  <Box key={pr} label={viewport}>
                    <SandpackPreview viewportSize={viewport as ViewportSize} />
                  </Box>
                );
              })}
            </div>
          </SandpackThemeProvider>
        </SandpackProvider>
      </>
    );
  },
});
