import { defineComponent } from 'vue';

export const Box = defineComponent({
  name: 'Box',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: false,
      default: undefined,
    },
    width: {
      type: String,
      required: false,
      default: undefined,
    },
    height: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          margin: 10,
          overflow: 'auto',
          border: '1px solid gray',
          width: props.width || 'auto',
          height: props.height || 'auto',
        }}
      >
        <span style={{ padding: '4px' }}>{props.label}</span>
        { slots.default ? slots.default() : null }
      </div>
    );
  },
});
