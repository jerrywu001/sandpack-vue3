import { defineComponent } from 'vue';
import { SandpackStack } from '../common';

export const SandpackRender = defineComponent({
  name: 'SandpackRender',
  props: {
    fragment: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () => props.fragment ? (
      <>
        { slots.default ? slots.default() : null }
      </>
    ) : (
      <SandpackStack>
        { slots.default ? slots.default() : null }
      </SandpackStack>
    );
  },
});
