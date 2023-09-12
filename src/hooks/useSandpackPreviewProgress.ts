import type { WorkerStatusUpdate } from '@codesandbox/nodebox';
import { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { onBeforeUnmount, onUnmounted, ref, watch } from 'vue';

import { useSandpack } from '..';

const mapProgressMessage = (
  originalMessage: WorkerStatusUpdate & { command?: string },
  firstTotalPending: number,
): string | null => {
  switch (originalMessage.state) {
    case 'downloading_manifest':
      return '[1/3] Downloading manifest';
    case 'downloaded_module':
      return `[2/3] Downloaded ${originalMessage.name} (${
        firstTotalPending - originalMessage.totalPending
      }/${firstTotalPending})`;
    case 'starting_command':
      return '[3/3] Starting command';
    case 'command_running':
      return `[3/3] Running "${originalMessage.command?.trim()}"`;
  }
};

export const useSandpackPreviewProgress = (
  props:
  | {
    timeout?: number;
    clientId?: string;
  }
  | undefined,
) => {
  let unsubscribe: UnsubscribeFunction;
  let timer: NodeJS.Timer;

  const isReady = ref(false);
  const totalDependencies = ref<number>();
  const loadingMessage = ref<null | string>(null);

  const { listen } = useSandpack();

  watch(
    [
      totalDependencies,
      isReady,
      () => props?.timeout,
      () => props?.clientId,
    ],
    () => {
      if (unsubscribe) unsubscribe();

      unsubscribe = listen((message) => {
        if (message.type === 'start' && message.firstLoad) {
          isReady.value = false;
        }

        if (props?.timeout) {
          timer = setTimeout(() => {
            loadingMessage.value = null;
          }, props?.timeout);
        }

        if (message.type === 'shell/progress' && !isReady.value) {
          if (!totalDependencies.value && message.data.state === 'downloaded_module') {
            totalDependencies.value = message.data.totalPending;
          }
          if (totalDependencies.value !== undefined) {
            loadingMessage.value = mapProgressMessage(message.data, totalDependencies.value);
          }
        }
        if (message.type === 'done' && message.compilatonError === false) {
          isReady.value = true;
          loadingMessage.value = null;
          clearTimeout(timer as any);
        }
      }, props?.clientId);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer as any);
    }
    if (unsubscribe) unsubscribe();
  });

  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer as any);
    }
    if (unsubscribe) unsubscribe();
  });

  return loadingMessage;
};
