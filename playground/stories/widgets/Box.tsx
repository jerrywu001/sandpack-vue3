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
          margin: '10px',
          overflow: 'auto',
          border: '1px solid gray',
          width: !props.width ? 'auto' : `${props.width}px`,
          height: !props.height ? 'auto' : `${props.height}px`,
        }}
      >
        <span style={{ padding: '4px' }}>{props.label}</span>
        { slots.default ? slots.default() : null }
      </div>
    );
  },
});
