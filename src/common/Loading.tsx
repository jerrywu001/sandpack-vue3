import { defineComponent } from 'vue';
import { css, keyframes } from '../styles';
import { buttonClassName } from '../styles/shared';

import { OpenInCodeSandboxButton } from './OpenInCodeSandboxButton';
import { useClassNames } from '..';

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

  [`.${cubeClassName}`]: { display: 'flex' },
  [`.sp-button.${buttonClassName}`]: { display: 'none' },
  [`&:hover .sp-button.${buttonClassName}`]: { display: 'flex' },
  [`&:hover .sp-button.${buttonClassName} > span`]: { display: 'none' },
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
  props: {
    showOpenInCodeSandbox: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const classNames = useClassNames();

    return () => (
      <div
        class={classNames('cube-wrapper', [wrapperClassName, attrs?.class || ''])}
        title="Open in CodeSandbox"
      >
        { props.showOpenInCodeSandbox && <OpenInCodeSandboxButton /> }
        <div class={classNames('cube', [cubeClassName])}>
          <div class={classNames('sides', [sidesClassNames])}>
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
