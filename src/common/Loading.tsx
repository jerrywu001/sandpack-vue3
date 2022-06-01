import { useClasser } from 'code-hike-classer-vue3';
import { defineComponent, HTMLAttributes } from 'vue';
import { css, THEME_PREFIX, keyframes } from '../styles';
import { buttonClassName } from '../styles/shared';
import { classNames } from '../utils/classNames';

import { OpenInCodeSandboxButton } from './OpenInCodeSandboxButton';

const cubeClassName = css({
  transform: 'translate(-4px, 9px) scale(0.13, 0.13)',
  '*': { position: 'absolute', width: '96px', height: '96px' },
});

const wrapperClassName = css({
  position: 'absolute',
  right: '$space$2',
  bottom: '$space$2',
  zIndex: '$top',
  width: '32px',
  height: '32px',
  borderRadius: '$border$radius',

  [`.${cubeClassName}`]: { display: 'block' },
  [`.${buttonClassName}`]: { display: 'none' },
  [`&:hover .${buttonClassName}`]: { display: 'block' },
  [`&:hover .${cubeClassName}`]: { display: 'none' },
});

const cubeRotate = keyframes({
  '0%': {
    transform: 'rotateX(-25.5deg) rotateY(45deg)',
  },

  '100%': {
    transform: 'rotateX(-25.5deg) rotateY(405deg)',
  },
});

const sidesClassNames = css({
  animation: `${cubeRotate} 1s linear infinite`,
  animationFillMode: 'forwards',
  transformStyle: 'preserve-3d',
  transform: 'rotateX(-25.5deg) rotateY(45deg)',

  '*': {
    border: '10px solid $colors$clickable',
    borderRadius: '8px',
    background: '$colors$surface1',
  },

  '.top': {
    transform: 'rotateX(90deg) translateZ(44px)',
    transformOrigin: '50% 50%',
  },
  '.bottom': {
    transform: 'rotateX(-90deg) translateZ(44px)',
    transformOrigin: '50% 50%',
  },
  '.front': {
    transform: 'rotateY(0deg) translateZ(44px)',
    transformOrigin: '50% 50%',
  },
  '.back': {
    transform: 'rotateY(-180deg) translateZ(44px)',
    transformOrigin: '50% 50%',
  },
  '.left': {
    transform: 'rotateY(-90deg) translateZ(44px)',
    transformOrigin: '50% 50%',
  },
  '.right': {
    transform: 'rotateY(90deg) translateZ(44px)',
    transformOrigin: '50% 50%',
  },
});

export const Loading = defineComponent({
  name: 'Loading',
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const c = useClasser(THEME_PREFIX);

    return () => (
      <div
        class={classNames(c('cube-wrapper'), wrapperClassName, props.className)}
        title="Open in CodeSandbox"
      >
        <OpenInCodeSandboxButton />
        <div class={classNames(c('cube'), cubeClassName)}>
          <div class={classNames(c('sides'), sidesClassNames)}>
            <div class="top" />
            <div class="right" />
            <div class="bottom" />
            <div class="left" />
            <div class="front" />
            <div class="back" />
          </div>
        </div>
      </div>
    );
  },
});
