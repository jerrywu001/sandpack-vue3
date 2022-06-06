import { classNames } from '../../utils/classNames';
import { css, THEME_PREFIX } from '../../styles';
import { ErrorOverlay } from '../../common/ErrorOverlay';
import { generateRandomId } from '../../utils/stringUtils';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { Navigator } from '../navigator';
import { OpenInCodeSandboxButton } from '../../common/OpenInCodeSandboxButton';
import { RefreshButton } from './RefreshButton';
import { SandpackStack } from '../../common/Stack';
import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import {
  CSSProperties,
  DefineComponent,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from 'vue';
import type { SandpackClient, SandpackMessage, UnsubscribeFunction } from '@codesandbox/sandpack-client';

export interface PreviewProps {
  className?: string;
  style?: CSSProperties;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
  actionsChildren?: JSX.Element;
}

export { RefreshButton };

const previewClassName = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  overflow: 'auto',
  position: 'relative',
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

  '> *': { marginLeft: '$space$2' },
});

export interface SandpackPreviewRef {
  /**
   * Retrieve the current Sandpack client instance from preview
   */
  getClient: () => SandpackClient | undefined;
  /**
   * Returns the client id, which will be used to
   * initialize a client in the main Sandpack context
   */
  clientId: string;
}

export const SandpackPreview = defineComponent({
  name: 'SandpackPreview',
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
    style: {
      type: Object as PropType<CSSProperties>,
      required: false,
      default() {
        return {};
      },
    },
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
    actionsChildren: {
      type: Object as PropType<JSX.Element>,
      required: false,
      default: null,
    },
  },
  // @ts-ignore
  setup(props: PreviewProps, { slots, expose }) {
    const { sandpack, listen } = useSandpack();
    const iframeComputedHeight = ref<number | null>(null);

    let unsubscribe: UnsubscribeFunction;

    const c = useClasser(THEME_PREFIX);
    const clientId = ref<string>(generateRandomId());
    const iframeRef = ref<HTMLIFrameElement | null>(null);

    // SandpackPreview immediately registers the custom screens/components so the bundler does not render any of them
    sandpack.openInCSBRegisteredRef = true;
    sandpack.errorScreenRegisteredRef = true;
    sandpack.loadingScreenRegisteredRef = true;

    onMounted(() => {
      nextTick(() => {
        const iframeElement = iframeRef.value;
        const clientIdValue = clientId.value;

        sandpack.registerBundler(iframeElement as HTMLIFrameElement, clientIdValue);

        unsubscribe = listen((message: SandpackMessage) => {
          if (message.type === 'resize') {
            iframeComputedHeight.value = message.height;
          }
        }, clientIdValue);
      });
    });

    onUnmounted(() => {
      const clientIdValue = clientId.value;
      if (unsubscribe) unsubscribe();
      if (sandpack.unregisterBundler) sandpack.unregisterBundler(clientIdValue);
    });

    expose({
      clientId: clientId.value,
      getClient(): SandpackClient | undefined {
        return sandpack.clients[clientId.value];
      },
    });

    const handleNewURL = (newUrl: string): void => {
      if (!iframeRef.value) {
        return;
      }

      iframeRef.value.src = newUrl;
    };

    return () => (
      <SandpackStack
        { ...props }
        class={props.className}
        style={{
          ...(props.style || {}),
        }}
      >
        { props.showNavigator && <Navigator clientId={clientId.value} onURLChange={handleNewURL} /> }

        <div class={classNames(c('preview-container'), previewClassName)}>
          <iframe
            ref={iframeRef}
            class={classNames(c('preview-iframe'), previewIframe)}
            style={{
              // set height based on the content only in auto mode
              // and when the computed height was returned by the bundler
              height: iframeComputedHeight.value ? `${iframeComputedHeight.value}px` : undefined,
            }}
            title="Sandpack Preview"
          />

          { props.showSandpackErrorOverlay && <ErrorOverlay /> }

          <div
            class={classNames(
              c('preview-actions'),
              previewActionsClassName,
            )}
          >
            {
              slots.actionsChildren
                ? slots.actionsChildren()
                : props.actionsChildren ? props.actionsChildren : null
            }
            {
              !props.showNavigator && props.showRefreshButton && sandpack.status === 'running' && (
                <RefreshButton clientId={clientId.value} />
              )
            }

            { props.showOpenInCodeSandbox && <OpenInCodeSandboxButton /> }
          </div>

          <LoadingOverlay
            clientId={clientId.value}
            showOpenInCodeSandbox={props.showOpenInCodeSandbox as boolean}
          />

          {slots.default ? slots.default() : null}
        </div>
      </SandpackStack>
    );
  },
}) as DefineComponent<PreviewProps>;
