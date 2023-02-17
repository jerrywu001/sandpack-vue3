import { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { computed, onBeforeUnmount, onUnmounted, Ref, ref, watch } from 'vue';
import { useSandpack } from '../../contexts/sandpackContext';
import {
  CLEAR_LOG,
  MAX_MESSAGE_COUNT,
  SYNTAX_ERROR_PATTERN,
} from './utils/constraints';
import type { SandpackConsoleData } from './utils/getType';

/**
 * It provides an interface to consume the logs from a sandpack client.
 *
 * @category Hooks
 */
export const useSandpackConsole = (props?: {
  clientId?: string;
  maxMessageCount?: number;
  showSyntaxError?: boolean;
  resetOnPreviewRestart?: boolean;
}): { logs: Ref<SandpackConsoleData>; reset: () => void } => {
  let unsubscribe: UnsubscribeFunction;
  const logs = ref<SandpackConsoleData>([]);
  const { listen } = useSandpack();

  const resetOnPreviewRestart = computed(() => props?.resetOnPreviewRestart ?? false);
  const showSyntaxError = computed(() => props?.showSyntaxError ?? false);
  const maxMessageCount = computed(() => props?.maxMessageCount ?? MAX_MESSAGE_COUNT);

  const listenMsg = () => {
    if (unsubscribe) unsubscribe();

    unsubscribe = listen((message) => {
      if (resetOnPreviewRestart.value && message.type === 'start') {
        logs.value = [];
      } else if (message.type === 'console' && message.codesandbox) {
        const payloadLog = Array.isArray(message.log)
          ? message.log
          : [message.log];

        if (payloadLog.find(({ method }) => method === 'clear')) {
          logs.value = [CLEAR_LOG];
          return;
        }

        const logsMessages = showSyntaxError.value
          ? payloadLog
          : payloadLog.filter((messageItem) => {
            const messagesWithoutSyntaxErrors = messageItem?.data?.filter?.(
              (dataItem) => {
                if (typeof dataItem !== 'string') return true;

                const matches = SYNTAX_ERROR_PATTERN.filter((lookFor) => dataItem.startsWith(lookFor));

                return matches.length === 0;
              },
            ) ?? [];

            return messagesWithoutSyntaxErrors.length > 0;
          });

        if (!logsMessages) return;

        const messages = [...logs.value, ...logsMessages].filter(
          (value, index, self) => index === self.findIndex((s) => s.id === value.id),
        );

        while (messages.length > MAX_MESSAGE_COUNT) {
          messages.shift();
        }

        logs.value = messages;
      }
    }, props?.clientId);
  };

  watch(
    [
      maxMessageCount,
      showSyntaxError,
      () => props?.clientId,
    ],
    () => {
      listenMsg();
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    if (unsubscribe) unsubscribe();
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  return { logs, reset: () => { logs.value = []; } };
};
