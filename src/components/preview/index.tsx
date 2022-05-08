import type { SandpackClient, SandpackMessage, UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import { CSSProperties, DefineComponent, defineComponent, nextTick, onMounted, PropType, ref } from 'vue';

import { ErrorOverlay } from '../../common/ErrorOverlay';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { OpenInCodeSandboxButton } from '../../common/OpenInCodeSandboxButton';
import { SandpackStack } from '../../common/Stack';
import { generateRandomId } from '../../utils/stringUtils';
import { Navigator } from '../navigator';

import { RefreshButton } from './RefreshButton';

export type ViewportSizePreset =
  | 'iPhone X'
  | 'Pixel 2'
  | 'iPad'
  | 'Moto G4'
  | 'Surface Duo';

export type ViewportSize =
  | ViewportSizePreset
  | 'auto'
  | { width: number; height: number };

export type ViewportOrientation = 'portrait' | 'landscape';

export interface PreviewProps {
  customStyle?: CSSProperties;
  viewportSize?: ViewportSize;
  viewportOrientation?: ViewportOrientation;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
  actionsChildren?: JSX.Element;
  children?: JSX.Element;
}

export { RefreshButton };

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
    customStyle: {
      type: Object as PropType<PreviewProps>,
      required: false,
      default: undefined,
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
    viewportSize: {
      type: String as PropType<ViewportSize>,
      required: false,
      default: 'auto',
    },
    viewportOrientation: {
      type: String as PropType<ViewportOrientation>,
      required: false,
      default: 'portrait',
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

    const c = useClasser('sp');
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

        if (unsubscribe) unsubscribe();
        if (sandpack.unregisterBundler) sandpack.unregisterBundler(clientIdValue);

        sandpack.registerBundler(iframeElement as HTMLIFrameElement, clientIdValue);

        unsubscribe = listen((message: SandpackMessage) => {
          if (message.type === 'resize') {
            iframeComputedHeight.value = message.height;
          }
        }, clientIdValue);
      });
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

    const viewportStyle = computeViewportSize(
      props.viewportSize as ViewportSize,
      props.viewportOrientation as ViewportOrientation,
    );

    return () => (
      <SandpackStack
        customStyle={{
          ...props.customStyle,
          ...viewportStyle,
        }}
      >
        {props.showNavigator ? (
          <Navigator clientId={clientId.value} onURLChange={handleNewURL} />
        ) : null}

        <div class={c('preview-container')}>
          <iframe
            ref={iframeRef}
            class={c('preview-iframe')}
            style={{
              // set height based on the content only in auto mode
              // and when the computed height was returned by the bundler
              height:
                props.viewportSize === 'auto' && iframeComputedHeight.value
                  ? iframeComputedHeight.value
                  : undefined,
            }}
            title="Sandpack Preview"
          />

          {props.showSandpackErrorOverlay ? <ErrorOverlay /> : null}

          <div class={c('preview-actions')}>
            { props.actionsChildren }
            {
              !props.showNavigator && props.showRefreshButton && sandpack.status === 'running' ? (
                <RefreshButton clientId={clientId.value} />
              ) : null
            }

            { props.showOpenInCodeSandbox ? <OpenInCodeSandboxButton /> : null }
          </div>

          <LoadingOverlay clientId={clientId.value} />

          {slots.default ? slots.default() : null}
        </div>
      </SandpackStack>
    );
  },
}) as DefineComponent<PreviewProps>;

const VIEWPORT_SIZE_PRESET_MAP: Record<
ViewportSizePreset,
{ x: number; y: number }
> = {
  'iPhone X': { x: 375, y: 812 },
  iPad: { x: 768, y: 1024 },
  'Pixel 2': { x: 411, y: 731 },
  'Moto G4': { x: 360, y: 640 },
  'Surface Duo': { x: 540, y: 720 },
};

const computeViewportSize = (
  viewport: ViewportSize,
  orientation: ViewportOrientation,
): { width?: number; height?: number } => {
  if (viewport === 'auto') {
    return {};
  }

  if (typeof viewport === 'string') {
    const { x, y } = VIEWPORT_SIZE_PRESET_MAP[viewport];
    return orientation === 'portrait'
      ? { width: x, height: y }
      : { width: y, height: x };
  }

  return viewport;
};
