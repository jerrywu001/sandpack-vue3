import {
  absoluteClassName,
  buttonClassName,
  errorBundlerClassName,
  errorClassName,
  errorMessageClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from '../styles/shared';
import { classNames } from '../utils/classNames';
import { css, THEME_PREFIX } from '../styles';
import { computed, defineComponent } from 'vue';
import { RestartIcon } from '../icons';
import { useClasser } from 'code-hike-classer-vue3';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useSandpackShell } from '../hooks';
import { useSandpack } from '../contexts/sandpackContext';

const mapBundlerErrors = (originalMessage: string): string => {
  const errorMessage = originalMessage.replace('[sandpack-client]: ', '');

  if (/process.exit/.test(errorMessage)) {
    const exitCode = errorMessage.match(/process.exit\((\d+)\)/);

    if (!exitCode) return errorMessage;

    // Crash
    if (Number(exitCode[1]) === 0) {
      return 'Server is not running, would you like to start it again?';
    }

    return `Server has crashed with status code ${exitCode[1]}, would you like to restart the server?`;
  }

  return errorMessage;
};

export const ErrorOverlay = defineComponent({
  name: 'ErrorOverlay',
  props: {
    clientId: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { slots, attrs }) {
    const error = useErrorMessage();
    const { restart } = useSandpackShell();
    const { sandpack } = useSandpack();
    const c = useClasser(THEME_PREFIX);

    const isSandpackBundlerError = computed(() => error.value?.message?.startsWith('[sandpack-client]'));

    return () => (
      <>
        {
          (isSandpackBundlerError.value && error.value?.message) ? (
            <div
              class={classNames(
                c('overlay', 'error'),
                absoluteClassName,
                errorBundlerClassName,
                attrs?.class || '',
              )}
              {...props}
            >
              <div class={classNames(c('error-message'), errorMessageClassName)}>
                <p class={classNames(css({ fontWeight: 'bold' }))}>
                  Couldn't connect to server
                </p>
                <p>{mapBundlerErrors(error.value?.message)}</p>

                <div>
                  <button
                    class={classNames(
                      c('button', 'icon-standalone'),
                      buttonClassName,
                      iconStandaloneClassName,
                      roundedButtonClassName,
                    )}
                    onClick={() => {
                      restart();
                      if (sandpack) sandpack.runSandpack();
                    }}
                    title="Restart script"
                    type="button"
                  >
                    <RestartIcon /> <span>Restart</span>
                  </button>
                </div>
              </div>
            </div>
          ) : !error.value.message && !slots.default ? null : (
            <div
              class={classNames(
                c('overlay', 'error'),
                absoluteClassName,
                errorClassName,
                attrs?.class || '',
              )}
              translate="no"
            >
              <div class={classNames(c('error-message'), errorMessageClassName)}>
                {error.value?.message || (slots.default ? slots.default() : null) }
              </div>
              {/* <RoundedButton onClick={() => dispatch({ type: 'refresh' }, props.clientId)}>
                <RefreshIcon />
              </RoundedButton> */}
            </div>
          )
        }
      </>
    );
  },
});
