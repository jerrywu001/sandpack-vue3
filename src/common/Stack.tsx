import { useClasser } from 'code-hike-classer-vue3';
import { css, THEME_PREFIX } from '../styles';
import { defineComponent, StyleValue } from 'vue';
import { classNames } from '../utils/classNames';

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
    const c = useClasser(THEME_PREFIX);

    return () => (
      <div
        class={classNames(c('stack'), stackClassName, attrs?.class || '')}
        style={(attrs?.style || {}) as StyleValue}
      >
        { slots.default ? slots.default() : null }
      </div>
    );
  },
});
