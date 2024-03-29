import type { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { useSandpack } from '../contexts/sandpackContext';
import { onBeforeMount, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';

export type LoadingOverlayState =
  | 'LOADING'
  | 'PRE_FADING'
  | 'FADING'
  | 'HIDDEN'
  | 'TIMEOUT';

export const FADE_ANIMATION_DURATION = 200;

interface LoadingOverlayStateProp {
  clientId?: string;

  /**
   * It enforces keeping the loading state visible,
   * which is helpful for external loading states.
   */
  loading?: boolean;
}

/**
 * @category Hooks
 */
export const useLoadingOverlayState = (props: LoadingOverlayStateProp) => {
  let unsubscribe: UnsubscribeFunction;
  let fadeTimeout: NodeJS.Timer;
  const { sandpack, listen } = useSandpack();
  const state = ref<LoadingOverlayState>('LOADING');

  const handleListener = () => {
    if (unsubscribe) unsubscribe();

    unsubscribe = listen((message) => {
      if (message.type === 'start' && message.firstLoad === true) {
        state.value = 'LOADING';
      }

      if (message.type === 'done') {
        state.value = state.value === 'LOADING' ? 'PRE_FADING' : 'HIDDEN';
      }
    }, props.clientId);
  };

  onBeforeMount(() => {
    state.value = 'LOADING';
  });

  onBeforeUnmount(() => {
    if (unsubscribe) unsubscribe();
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  watch(
    () => sandpack.status,
    () => {
      if (sandpack.status !== 'running') {
        state.value = 'HIDDEN';
      }

      if (sandpack.status === 'timeout') {
        state.value = 'TIMEOUT';
      }

      if (sandpack.status === 'idle') {
        handleListener();
      }
    },
    { immediate: true },
  );

  watch(
    () => props.clientId,
    handleListener,
    { immediate: true },
  );

  /**
   * Fading transient state
   */
  watch(
    [
      state,
      () => props.loading,
    ],
    () => {
      if (fadeTimeout) clearTimeout(fadeTimeout as any);

      if (state.value === 'PRE_FADING' && !props.loading) {
        state.value = 'FADING';
      } else if (state.value === 'FADING') {
        if (fadeTimeout) clearTimeout(fadeTimeout as any);
        fadeTimeout = setTimeout(
          () => {
            state.value = 'HIDDEN';
          },
          FADE_ANIMATION_DURATION,
        );
      }
    },
    { deep: true, immediate: true },
  );

  return state;
};
