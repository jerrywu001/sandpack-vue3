import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../contexts/sandpackContext';
import { defineComponent, Ref, ref, watch } from 'vue';
import { css, THEME_PREFIX } from '../styles';
import { stackClassName } from './Stack';
import { classNames } from '../utils/classNames';

export const layoutClassName = css({
  border: '1px solid $colors$surface2',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  borderRadius: '$border$radius',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '$colors$surface2',
  gap: '1px',

  [`> .${stackClassName}`]: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0',
    height: '$layout$height',

    '@media print': {
      height: 'auto',
      display: 'block',
    },

    '@media screen and (max-width: 768px)': {
      [`&:not(.${THEME_PREFIX}-preview, .${THEME_PREFIX}-editor, .${THEME_PREFIX}-preset-column)`]: {
        height: 'calc($layout$height / 2)',
      },
      /* triggers the layout break at the 768px breakpoint, not when the component is less then 700px */
      minWidth: '100%;',
    },
  },
  [`> .${THEME_PREFIX}-file-explorer`]: {
    flex: 0.2,
    minWidth: '200px',
    '@media screen and (max-width: 768px)': {
      '&': {
        minWidth: '100% !important',
      },
    },
  },
});

export const SandpackLayout = defineComponent({
  name: 'SandpackLayout',
  setup(_, { slots, attrs }) {
    const lazyAnchorRef = ref<HTMLDivElement>();
    const { sandpack } = useSandpack();
    const c = useClasser(THEME_PREFIX);

    watch(lazyAnchorRef, () => {
      if (sandpack && lazyAnchorRef.value) {
        sandpack.lazyAnchorRef = lazyAnchorRef as Ref<HTMLDivElement>;
      }
    });

    return () => (
      <div
        ref={lazyAnchorRef}
        class={classNames(c('layout'), layoutClassName, attrs?.class || '')}
      >
        { slots.default ? slots.default() : null }
      </div>
    );
  },
});
