import { useClasser } from 'code-hike-classer-vue3';
import { computed, CSSProperties, DefineComponent, defineComponent, PropType } from 'vue';
import { useLoadingOverlayState, FADE_ANIMATION_DURATION } from '../hooks/useLoadingOverlayState';
import { css, THEME_PREFIX } from '../styles';
import { Loading } from './Loading';
import { classNames } from '../utils/classNames';
import { absoluteClassName, errorClassName, errorMessageClassName } from '../styles/shared';
import { useSandpack } from '../contexts/sandpackContext';

export interface LoadingOverlayProps {
  style?: CSSProperties;
  className?: String;
  clientId?: string;
  /**
   * It enforces keeping the loading state visible,
   * which is helpful for external loading states.
   */
  loading?: boolean;
  showOpenInCodeSandbox: boolean;
}

const loadingClassName = css({
  backgroundColor: '$colors$surface1',
});

export const LoadingOverlay = defineComponent({
  name: 'LoadingOverlay',
  inheritAttrs: true,
  props: {
    clientId: String,
    loading: Boolean,
    style: {
      type: Object as PropType<CSSProperties>,
      required: false,
      default() {
        return {};
      },
    },
    className: {
      type: String,
      required: false,
      default: '',
    },
    showOpenInCodeSandbox: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props: LoadingOverlayProps) {
    const { sandpack } = useSandpack();
    const loadingOverlayState = useLoadingOverlayState(props);
    const c = useClasser(THEME_PREFIX);

    const isLoading = computed(() => (loadingOverlayState.value === 'LOADING'));
    const stillLoading = computed(() => (isLoading.value || loadingOverlayState.value === 'PRE_FADING'));
    const notHidden = computed(() => loadingOverlayState.value !== 'HIDDEN');
    const timeout = computed(() => loadingOverlayState.value === 'TIMEOUT');

    const timeoutLayout = () => (
      <div
        class={classNames(
          c('overlay', 'error'),
          absoluteClassName,
          errorClassName,
          props.className,
        )}
      >
        <div class={classNames(c('error-message'), errorMessageClassName)}>
          Unable to establish connection with the sandpack bundler. Make sure
          you are online or try again later. If the problem persists, please
          report it via{' '}
          <a
            class={classNames(c('error-message'), errorMessageClassName)}
            href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error"
          >
            email
          </a>{' '}
          or submit an issue on{' '}
          <a
            class={classNames(c('error-message'), errorMessageClassName)}
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
        class={classNames(
          c('overlay', 'loading'),
          absoluteClassName,
          loadingClassName,
          props.className,
        )}
        style={{
          ...(props.style || {}),
          opacity: stillLoading.value && (sandpack.status && sandpack.status !== 'idle') ? 1 : 0,
          transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
        }}
      >
        <Loading showOpenInCodeSandbox={props.showOpenInCodeSandbox} />
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
