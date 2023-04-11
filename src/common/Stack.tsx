import { css, THEME_PREFIX } from '../styles';
import { defineComponent, StyleValue } from 'vue';
import { useClassNames } from '..';

export const stackClassName = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  backgroundColor: '$colors$surface1',
  gap: '1px', // border between components

  [`&:has(.${THEME_PREFIX}-stack)`]: {
    backgroundColor: '$colors$surface2',
  },
});

export const SandpackStack = defineComponent({
  name: 'SandpackStack',
  setup(_, { slots, attrs }) {
    const classNames = useClassNames();

    return () => (
      <div
        class={classNames('stack', [stackClassName, attrs?.class || ''])}
        style={(attrs?.style || {}) as StyleValue}
      >
        { slots.default ? slots.default() : null }
      </div>
    );
  },
});
