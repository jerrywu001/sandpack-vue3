import { SandpackLayout, SandpackProvider } from '@codesandbox/sandpack-vue3';
import { defineComponent } from 'vue';

export const Provider = defineComponent({
  name: 'Provider',
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => (
      <SandpackProvider>
        <SandpackLayout>{ slots.default ? slots.default() : null }</SandpackLayout>
      </SandpackProvider>
    );
  },
});
