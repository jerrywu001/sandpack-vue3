import {
  computed,
  DefineComponent,
  defineComponent,
  onBeforeUnmount,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { css } from '../styles';
import { FADE_ANIMATION_DURATION, useLoadingOverlayState } from '../hooks/useLoadingOverlayState';
import { Loading } from './Loading';
import { RestartIcon } from '../icons';
import { StdoutList } from '../components/console/StdoutList';
import { useSandpackPreviewProgress } from '../hooks/useSandpackPreviewProgress';
import { useSandpack } from '../contexts/sandpackContext';
import { useSandpackShellStdout } from '../hooks/useSandpackShellStdout';
import {
  absoluteClassName,
  buttonClassName,
  errorBundlerClassName,
  errorClassName,
  errorMessageClassName,
  fadeIn,
  iconStandaloneClassName,
  roundedButtonClassName,
} from '../styles/shared';
import { useSandpackShell } from '../hooks';
import { useClassNames } from '..';

export interface LoadingOverlayProps {
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
  props: {
    clientId: String,
    loading: Boolean,
    showOpenInCodeSandbox: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props: LoadingOverlayProps, { attrs }) {
    let timer: NodeJS.Timer;
    const { sandpack } = useSandpack();
    const { restart } = useSandpackShell(props.clientId);
    const classNames = useClassNames();
    const shouldShowStdout = ref(false);

    const loadingOverlayState = useLoadingOverlayState(props);
    const progressMessage = useSandpackPreviewProgress({ clientId: props?.clientId });
    const { logs: stdoutData } = useSandpackShellStdout({ clientId: props?.clientId });

    const notHidden = computed(() => loadingOverlayState.value !== 'HIDDEN');
    const timeout = computed(() => loadingOverlayState.value === 'TIMEOUT');
    const isLoading = computed(() => loadingOverlayState.value === 'LOADING');
    const stillLoading = computed(() => (isLoading.value || loadingOverlayState.value === 'PRE_FADING'));

    const timeoutLayout = () => (
      <div
        class={classNames('overlay', [
          classNames('error'),
          absoluteClassName,
          errorClassName,
          errorBundlerClassName,
          attrs?.class || '',
        ])}
      >
        <div class={classNames(classNames('error-message', [errorMessageClassName]))}>
          <p class={classNames('error-title', [css({ fontWeight: 'bold' })])}>
            Couldn't connect to server
          </p>

          <div class={classNames('error-message', [errorMessageClassName])}>
            <p>
              This means sandpack cannot connect to the runtime or your network
              is having some issues. Please check the network tab in your
              browser and try again. If the problem persists, report it via{' '}
              <a href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error">
                email
              </a>{' '}
              or submit an issue on{' '}
              <a
                href="https://github.com/codesandbox/sandpack/issues"
                rel="noreferrer noopener"
                target="_blank"
              >
                GitHub.
              </a>
            </p>
          </div>

          <p
            class={classNames('error-message', [
              errorMessageClassName({ errorCode: true }),
            ])}
          >
            ENV: {sandpack.environment}
            <br />
            ERROR: TIME_OUT
          </p>

          <div>
            <button
              class={classNames('button', [
                classNames('icon-standalone'),
                buttonClassName,
                iconStandaloneClassName,
                roundedButtonClassName,
              ])}
              onClick={async () => {
                if (sandpack) await sandpack.runSandpack();
                restart();
              }}
              title="Restart script"
              type="button"
            >
              <RestartIcon />
              <span>Try again</span>
            </button>
          </div>
        </div>
      </div>
    );

    watch(
      progressMessage,
      () => {
        if (timer) clearTimeout(timer as any);
        if (progressMessage.value?.includes('Running')) {
          timer = setTimeout(() => {
            shouldShowStdout.value = true;
          }, 3_000);
        }
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      if (timer) clearTimeout(timer as any);
    });

    onUnmounted(() => {
      if (timer) clearTimeout(timer as any);
    });

    return () => (
      <>
        {
          notHidden.value
            ? timeout.value
              ? timeoutLayout()
              : isLoading.value ? (
                <>
                  <div
                    class={classNames('overlay', [
                      classNames('loading'),
                      absoluteClassName,
                      loadingClassName,
                      attrs?.class || '',
                    ])}
                    style={{
                      ...(attrs.style || {}),
                      opacity: sandpack && stillLoading.value && (sandpack.status && sandpack.status !== 'idle') ? 1 : 0,
                      transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
                    }}
                  >
                    {
                      shouldShowStdout.value && (
                        <div class={stdoutPreview.toString()}>
                          <StdoutList data={stdoutData.value} />
                        </div>
                      )
                    }
                    <Loading showOpenInCodeSandbox={props.showOpenInCodeSandbox} />
                  </div>

                  {
                    progressMessage.value && (
                      <div class={progressClassName.toString()}>
                        <p>{progressMessage.value}</p>
                      </div>
                    )
                  }
                </>
              ) : null
            : null
        }
      </>
    );
  },
}) as DefineComponent<LoadingOverlayProps>;

const stdoutPreview = css({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: '$space$8',
  overflow: 'auto',
  opacity: 0.5,
  overflowX: 'hidden',
});

const progressClassName = css({
  position: 'absolute',
  left: '$space$5',
  bottom: '$space$4',
  zIndex: '$top',
  color: '$colors$clickable',
  animation: `${fadeIn} 150ms ease`,
  fontFamily: '$font$mono',
  fontSize: '.8em',
  width: '75%',
  p: {
    whiteSpace: 'nowrap',
    margin: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
