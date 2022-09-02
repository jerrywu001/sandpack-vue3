import { generateRandomId } from '../utils/stringUtils';
import { toRaw, onBeforeUnmount, onMounted, onUnmounted, ref, Ref } from 'vue';
import { useSandpack } from '../contexts/sandpackContext';
import type {
  ListenerFunction,
  SandpackClient,
  SandpackMessage,
  UnsubscribeFunction,
} from '@codesandbox/sandpack-client';

import type { SandpackState } from '../types';

interface UseSandpackClient {
  sandpack: SandpackState;
  getClient: () => SandpackClient | null;
  iframe: Ref<HTMLIFrameElement | null>;
  listen: (listener: ListenerFunction) => UnsubscribeFunction;
  dispatch: (message: SandpackMessage) => void;
  clientId: Ref<string>;
}

/**
 * It registers a new sandpack client and returns its instance,
 * listeners, and dispatch function. Using it when creating a custom
 * component to interact directly with the client is recommended.
 * For other cases, use `useSandpack` instead.
 *
 * @category Hooks
 */
export const useSandpackClient = (): UseSandpackClient => {
  const { sandpack, listen, dispatch } = useSandpack();
  const iframeRef = ref<HTMLIFrameElement | null>(null);
  const clientId = ref<string>(generateRandomId());

  onMounted(() => {
    const iframeElement = iframeRef.value;

    if (iframeElement !== null) {
      sandpack.registerBundler(iframeElement, clientId.value);
    }
  });

  onBeforeUnmount(() => {
    if (sandpack && clientId.value) {
      sandpack.unregisterBundler(clientId.value);
    }
  });

  onUnmounted(() => {
    if (sandpack && clientId.value) {
      sandpack.unregisterBundler(clientId.value);
    }
  });

  const getClient = (): SandpackClient | null => {
    const { clients } = sandpack;
    return toRaw(clients[clientId.value] || null);
  };

  return {
    sandpack,
    getClient,
    clientId,
    iframe: iframeRef,
    listen: (listener): UnsubscribeFunction => listen(listener, clientId.value),
    dispatch: (message): void => dispatch(message, clientId.value),
  };
};
