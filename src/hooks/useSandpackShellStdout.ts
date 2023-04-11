import { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { type Ref, ref, watch, onBeforeUnmount, computed, onUnmounted, toRaw } from 'vue';
import { useSandpack } from '../contexts/sandpackContext';

import { generateRandomId } from '../utils/stringUtils';

const MAX_MESSAGE_COUNT = 400 * 2;

export const useSandpackShellStdout = (props?: {
  clientId?: string;
  maxMessageCount?: number;
  resetOnPreviewRestart?: boolean;
}): {
    logs: Ref<Array<{ id: string; data: string }>>;
    reset: () => void;
  } => {
  let unsubscribe: UnsubscribeFunction;
  const logs = ref<Array<{ id: string; data: string }>>([]);
  const { listen } = useSandpack();

  const maxMessageCount = computed(() => props?.maxMessageCount ?? MAX_MESSAGE_COUNT);
  const resetOnPreviewRestart = computed(() => props?.resetOnPreviewRestart ?? false);

  watch(
    [
      maxMessageCount,
      () => props?.clientId,
    ],
    () => {
      if (unsubscribe) {
        unsubscribe();
      }
      unsubscribe = listen((message) => {
        if (resetOnPreviewRestart.value && message.type === 'start') {
          logs.value = [];
        } else if (
          message.type === 'stdout' &&
          message.payload.data &&
          Boolean(message.payload.data.trim())
        ) {
          const prev = [...toRaw(logs.value)];
          const messages = [
            ...prev,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            { data: message.payload.data!, id: generateRandomId() },
          ];

          while (messages.length > maxMessageCount.value) {
            messages.shift();
          }

          logs.value = toRaw(messages);
        }
      }, props?.clientId);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    logs,
    reset: () => { logs.value = []; },
  };
};
