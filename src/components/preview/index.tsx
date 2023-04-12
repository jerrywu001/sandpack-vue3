import { buttonClassName, iconStandaloneClassName, roundedButtonClassName } from '../../styles/shared';
import { css, THEME_PREFIX } from '../../styles';
import { ErrorOverlay } from '../../common';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { Navigator } from '../navigator';
import { OpenInCodeSandboxButton } from '../../common/OpenInCodeSandboxButton';
import { RefreshIcon, RestartIcon, SignOutIcon } from '../../icons';
import { RoundedButton } from '../../common/RoundedButton';
import { SandpackStack } from '../../common/Stack';
import { useClassNames } from '../..';
import { useSandpackClient, useSandpackNavigation, useSandpackShell } from '../../hooks';
import {
  DefineComponent,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from 'vue';
import type { SandpackClient, SandpackMessage, UnsubscribeFunction } from '@codesandbox/sandpack-client';

export interface PreviewProps {
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showRestartButton?: boolean;
  /**
   * Whether to show the `<ErrorOverlay>` component on top of
   * the preview, if a runtime error happens.
   */
  showSandpackErrorOverlay?: boolean;
  showOpenNewtab?: boolean;
  actionsChildren?: JSX.Element;
  startRoute?: string;
}

const previewClassName = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  overflow: 'auto',
  position: 'relative',

  [`.${THEME_PREFIX}-bridge-frame`]: {
    border: 0,
    position: 'absolute',
    left: '$space$2',
    bottom: '$space$2',
    zIndex: '$top',
    height: 12,
    width: '30%',
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
  },
});

const previewIframe = css({
  border: '0',
  outline: '0',
  width: '100%',
  height: '100%',
  minHeight: '160px',
  maxHeight: '2000px',
  flex: 1,
});

const previewActionsClassName = css({
  display: 'flex',
  position: 'absolute',
  bottom: '$space$2',
  right: '$space$2',
  zIndex: '$overlay',
  gap: '$space$2',
});

export interface SandpackPreviewRef {
  /**
   * Retrieve the current Sandpack client instance from preview
   */
  getClient: () => InstanceType<typeof SandpackClient> | null;
  /**
   * Returns the client id, which will be used to
   * initialize a client in the main Sandpack context
   */
  clientId: string;
}

export const SandpackPreview = defineComponent({
  name: 'SandpackPreview',
  props: {
    showNavigator: {
      type: Boolean,
      required: false,
      default: false,
    },
    showRefreshButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showOpenInCodeSandbox: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSandpackErrorOverlay: {
      type: Boolean,
      required: false,
      default: true,
    },
    showOpenNewtab: {
      type: Boolean,
      required: false,
      default: true,
    },
    showRestartButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    actionsChildren: {
      type: Object as PropType<JSX.Element>,
      required: false,
      default: null,
    },
    startRoute: {
      type: String,
      required: false,
      default: '/',
    },
  },
  // @ts-ignore
  setup(props: PreviewProps, { slots, attrs, expose }) {
    const {
      sandpack,
      listen,
      iframe,
      getClient,
      clientId,
      dispatch,
    } = useSandpackClient({ startRoute: props?.startRoute });
    const iframeComputedHeight = ref<number | null>(null);

    let unsubscribe: UnsubscribeFunction;

    const classNames = useClassNames();

    const { refresh } = useSandpackNavigation(clientId.value);
    const { restart } = useSandpackShell(clientId.value);

    // SandpackPreview immediately registers the custom screens/components so the bundler does not render any of them
    sandpack.errorScreenRegisteredRef = true;
    sandpack.loadingScreenRegisteredRef = true;

    onMounted(() => {
      nextTick(() => {
        if (unsubscribe) unsubscribe();

        unsubscribe = listen((message: SandpackMessage) => {
          if (message.type === 'resize') {
            iframeComputedHeight.value = message.height;
          }
        });
      });
    });

    onBeforeUnmount(() => {
      if (unsubscribe) unsubscribe();
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });

    expose({
      clientId: clientId.value,
      getClient,
    });

    const handleNewURL = (newUrl: string): void => {
      if (!iframe.value) {
        return;
      }

      iframe.value.src = newUrl;
    };

    return () => (
      <SandpackStack
        { ...props }
        class={classNames('preview', [attrs?.class || ''])}
      >
        {
          props.showNavigator && (
            <Navigator clientId={clientId.value} startRoute={props?.startRoute} onURLChange={handleNewURL} />
          )
        }

        <div class={classNames('preview-container', [previewClassName])}>
          <iframe
            ref={iframe}
            class={classNames('preview-iframe', [previewIframe])}
            style={{
              // set height based on the content only in auto mode
              // and when the computed height was returned by the bundler
              height: iframeComputedHeight.value ? `${iframeComputedHeight.value}px` : undefined,
            }}
            title="Sandpack Preview"
          />

          <div
            class={classNames('preview-actions', [previewActionsClassName])}
          >
            {
              slots.actionsChildren
                ? slots.actionsChildren()
                : props.actionsChildren ? props.actionsChildren : null
            }

            {
              props.showRestartButton && sandpack.environment === 'node' && (
                <RoundedButton onClick={restart}>
                  <RestartIcon />
                </RoundedButton>
              )
            }

            {!props.showNavigator && props.showRefreshButton && sandpack.status === 'running' && (
              <RoundedButton onClick={refresh}>
                <RefreshIcon />
              </RoundedButton>
            )}

            {sandpack.teamId && (
              <button
                class={classNames('button', [
                  classNames('icon-standalone'),
                  buttonClassName,
                  iconStandaloneClassName,
                  roundedButtonClassName,
                ])}
                onClick={() => dispatch({ type: 'sign-out' })}
                title="Sign out"
                type="button"
              >
                <SignOutIcon />
              </button>
            )}

            { props.showOpenInCodeSandbox && <OpenInCodeSandboxButton /> }
          </div>

          <LoadingOverlay
            clientId={clientId.value}
            showOpenInCodeSandbox={props.showOpenInCodeSandbox as boolean}
          />

          { props.showSandpackErrorOverlay && <ErrorOverlay clientId={clientId.value} /> }
          { slots.default ? slots.default() : null }
        </div>
      </SandpackStack>
    );
  },
}) as DefineComponent<PreviewProps>;
