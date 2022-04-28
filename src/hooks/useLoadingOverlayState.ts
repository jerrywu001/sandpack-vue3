import { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { useSandpack } from '../contexts/sandpackContext';
import { Ref, ref, watch } from 'vue';

export type LoadingOverlayState =
  | 'LOADING'
  | 'PRE_FADING'
  | 'FADING'
  | 'HIDDEN'
  | 'TIMEOUT';

export const FADE_ANIMATION_DURATION = 200;

/**
 * @category Hooks
 */
export const useLoadingOverlayState = (
  clientId?: string,
  externalLoading?: boolean,
): Ref<LoadingOverlayState> => {
  let unsubscribe: UnsubscribeFunction;
  let fadeTimeout: NodeJS.Timer;
  const { sandpack, listen } = useSandpack();
  const state = ref<LoadingOverlayState>('LOADING');

  /**
   * Sandpack listener
   */
  watch([() => clientId, () => sandpack.status === 'idle'], () => {
    sandpack.loadingScreenRegisteredRef.value = true;

    if (unsubscribe) unsubscribe();

    unsubscribe = listen((message) => {
      if (message.type === 'start' && message.firstLoad === true) {
        state.value = 'LOADING';
      }

      if (message.type === 'done') {
        state.value = state.value === 'LOADING' ? 'PRE_FADING' : 'HIDDEN';
      }
    }, clientId);
  });

  /**
   * Fading transient state
   */
  watch([state, () => externalLoading], () => {
    if (fadeTimeout) clearTimeout(fadeTimeout);

    if (state.value === 'PRE_FADING' && !externalLoading) {
      state.value = 'FADING';
    } else if (state.value === 'FADING') {
      if (fadeTimeout) clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(
        () => {
          state.value = 'HIDDEN';
        },
        FADE_ANIMATION_DURATION,
      );
    }
  });

  if (sandpack.status === 'timeout') {
    return ref('TIMEOUT');
  }

  if (sandpack.status !== 'running') {
    return ref('HIDDEN');
  }

  return state;
};
