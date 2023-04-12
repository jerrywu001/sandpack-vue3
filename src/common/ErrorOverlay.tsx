import {
  absoluteClassName,
  buttonClassName,
  errorBundlerClassName,
  errorClassName,
  errorMessageClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from '../styles/shared';
import { css } from '../styles';
import { computed, defineComponent } from 'vue';
import { RestartIcon, SignInIcon } from '../icons';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useSandpackShell } from '../hooks';
import { useSandpack } from '../contexts/sandpackContext';
import { useClassNames } from '..';

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
    const { sandpack, dispatch } = useSandpack();
    const classNames = useClassNames();

    const isSandpackBundlerError = computed(() => error.value?.message?.startsWith('[sandpack-client]'));
    const privateDependencyError = computed(() => error.value?.message?.includes(
      'NPM_REGISTRY_UNAUTHENTICATED_REQUEST',
    ));

    const onSignIn = () => {
      if (sandpack?.teamId) {
        dispatch({ type: 'sign-in', teamId: sandpack.teamId });
      }
    };

    return () => (
      <>
        {
          privateDependencyError.value ? (
            <div
              {...props}
              class={classNames('overlay', [
                classNames('error'),
                absoluteClassName,
                errorBundlerClassName,
                attrs?.class || '',
              ])}
            >
              <p class={classNames('error-message', [errorMessageClassName])}>
                <strong>Unable to fetch required dependency.</strong>
              </p>

              <div class={classNames('error-message', [errorMessageClassName])}>
                <p>
                  Authentication required. Please sign in to your account (make sure
                  to allow pop-ups to this page) and try again. If the issue persists,
                  contact{' '}
                  <a href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error">
                    support
                  </a>{' '}
                  for further assistance.
                </p>
              </div>
              <div>
                <button
                  class={classNames('button', [
                    buttonClassName,
                    iconStandaloneClassName,
                    roundedButtonClassName,
                  ])}
                  onClick={onSignIn}
                >
                  <SignInIcon />
                  <span>Sign in</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {
                (isSandpackBundlerError.value && error.value?.message) ? (
                  <div
                    class={classNames('overlay', [
                      classNames('error'),
                      absoluteClassName,
                      errorBundlerClassName,
                      attrs?.class || '',
                    ])}
                    {...props}
                  >
                    <div class={classNames('error-message', [errorMessageClassName])}>
                      <p class={classNames('error-title', [css({ fontWeight: 'bold' })])}>
                        Couldn't connect to server
                      </p>
                      <p>{mapBundlerErrors(error.value?.message)}</p>

                      <div>
                        <button
                          class={classNames('button', [
                            classNames('icon-standalone'),
                            buttonClassName,
                            iconStandaloneClassName,
                            roundedButtonClassName,
                          ])}
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
                    class={classNames('overlay', [
                      classNames('error'),
                      absoluteClassName,
                      errorClassName({ solidBg: true }),
                      attrs?.class || '',
                    ])}
                    translate="no"
                  >
                    <p class={classNames('error-message', [errorMessageClassName])}>
                      <strong>Something went wrong</strong>
                    </p>
                    <p
                      class={classNames('error-message', [
                        errorMessageClassName({ errorCode: true }),
                      ])}
                    >
                      {error.value?.message || (slots.default ? slots.default() : null) }
                    </p>
                    {/* <RoundedButton onClick={() => dispatch({ type: 'refresh' }, props.clientId)}>
                      <RefreshIcon />
                    </RoundedButton> */}
                  </div>
                )
              }
            </>
          )
        }
      </>
    );
  },
});
