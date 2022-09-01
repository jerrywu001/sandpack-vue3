import { useClasser } from 'code-hike-classer-vue3';
import { css, THEME_PREFIX } from '../styles';
import { defineComponent } from 'vue';
import { classNames } from '../utils/classNames';

export const stackClassName = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  backgroundColor: '$colors$surface1',
  transition: 'flex $transitions$default',
  gap: 1, // border between components

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
      >
        { slots.default ? slots.default() : null }
      </div>
    );
  },
});
