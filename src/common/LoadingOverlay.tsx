import { useClasser } from 'code-hike-classer-vue3';
import { computed, DefineComponent, defineComponent } from 'vue';
import { useLoadingOverlayState, FADE_ANIMATION_DURATION } from '../hooks/useLoadingOverlayState';
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
    clientId: String,
    loading: Boolean,
  },
  setup(props: LoadingOverlayProps, { slots }) {
    const loadingOverlayState = useLoadingOverlayState(props);
    const c = useClasser('sp');

    const isLoading = computed(() => (loadingOverlayState.value === 'LOADING'));
    const stillLoading = computed(() => (isLoading.value || loadingOverlayState.value === 'PRE_FADING'));
    const notHidden = computed(() => loadingOverlayState.value !== 'HIDDEN');
    const timeout = computed(() => loadingOverlayState.value === 'TIMEOUT');

    const timeoutLayout = () => (
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

    const loadingLayout = () => (
      <div
        class={c('overlay', 'loading')}
        style={{
          opacity: stillLoading.value ? 1 : 0,
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

    return () => (
      <>
        {
          notHidden.value
            ? timeout.value
              ? timeoutLayout() : isLoading.value ? loadingLayout() : null
            : null
        }
      </>
    );
  },
}) as DefineComponent<LoadingOverlayProps>;
