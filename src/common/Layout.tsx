import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../contexts/sandpackContext';
import { DefineComponent, defineComponent, HtmlHTMLAttributes, Ref, ref, watch } from 'vue';
import { css, THEME_PREFIX } from '../styles';
import { absoluteClassName } from '../styles/shared';
import { stackClassName } from './Stack';
import { classNames } from '../utils/classNames';

export interface SandpackLayoutProps extends HtmlHTMLAttributes {
  className?: string;
}

export const layoutClassName = css({
  border: '1px solid $colors$surface2',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  background: '$colors$surface1',
  borderRadius: '$border$radius',
  overflow: 'hidden',

  '> *:not(:first-child)': {
    borderLeft: '1px solid $colors$surface2',
    borderTop: '1px solid $colors$surface2',
    marginLeft: '-1px',
    marginTop: '-1px',
    position: 'relative',
  },

  [`> *:first-child .${absoluteClassName}`]: {
    borderRight: '1px solid $colors$surface2',
  },

  [`> .${stackClassName}`]: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0',
    minWidth: '350px',
    height: '$layout$height',

    '@media print': {
      height: 'auto',
      display: 'block',
    },

    '@media screen and (max-width: 768px)': {
      height: 'auto',
      minWidth:
        '100% !important;' /* triggers the layout break at the 768px breakpoint, not when the component is less then 700px */,
    },
  },
});

export const SandpackLayout = defineComponent({
  name: 'SandpackLayout',
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { slots }) {
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
        class={classNames(c('layout'), layoutClassName, props.className)}
      >
        { slots.default ? slots.default() : null }
      </div>
    );
  },
}) as DefineComponent<SandpackLayoutProps>;
