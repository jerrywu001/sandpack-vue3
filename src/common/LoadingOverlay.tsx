import { useClasser } from 'code-hike-classer-vue3';
import { DefineComponent, defineComponent } from 'vue';
import {
  useLoadingOverlayState,
  FADE_ANIMATION_DURATION,
} from '../hooks/useLoadingOverlayState';

import { OpenInCodeSandboxButton } from './OpenInCodeSandboxButton';

export interface LoadingOverlayProps {
  clientId?: string;

  /**
   * It enforces keeping the loading state visible,
   * which is helpful for external loading states.
   */
  loading?: boolean;
}

export const LoadingOverlay = defineComponent({
  name: 'LoadingOverlay',
  inheritAttrs: true,
  props: {
    clientId: {
      type: String,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
  },
  setup(props: LoadingOverlayProps, { slots }) {
    const loadingOverlayState = useLoadingOverlayState(props.clientId, props.loading);
    const c = useClasser('sp');

    if (loadingOverlayState.value === 'HIDDEN') {
      return () => null;
    }

    if (loadingOverlayState.value === 'TIMEOUT') {
      return () => (
        <div class={c('overlay', 'error')}>
          <div class={c('error-message')}>
            Unable to establish connection with the sandpack bundler. Make sure
            you are online or try again later. If the problem persists, please
            report it via{' '}
            <a
              class={c('error-message')}
              href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error"
            >
              email
            </a>{' '}
            or submit an issue on{' '}
            <a
              class={c('error-message')}
              href="https://github.com/codesandbox/sandpack/issues"
              rel="noreferrer noopener"
              target="_blank"
            >
              GitHub.
            </a>
          </div>
        </div>
      );
    }

    const stillLoading =
      loadingOverlayState.value === 'LOADING' || loadingOverlayState.value === 'PRE_FADING';

    return () => (
      <div
        class={c('overlay', 'loading')}
        style={{
          opacity: stillLoading ? 1 : 0,
          transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
        }}
      >
        <div class="sp-cube-wrapper" title="Open in CodeSandbox">
          <OpenInCodeSandboxButton />
          <div class="sp-cube">
            <div class="sp-sides">
              <div class="sp-top" />
              <div class="sp-right" />
              <div class="sp-bottom" />
              <div class="sp-left" />
              <div class="sp-front" />
              <div class="sp-back" />
            </div>
          </div>
        </div>
      </div>
    );
  },
}) as DefineComponent<LoadingOverlayProps>;
