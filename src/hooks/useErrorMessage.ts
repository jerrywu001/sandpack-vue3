import { useSandpack } from '../contexts/sandpackContext';
import { computed, ComputedRef } from 'vue';
import type { SandpackError } from '@codesandbox/sandpack-client';

/**
 * @category Hooks
 */
export const useErrorMessage = (): ComputedRef<SandpackError> => {
  const { sandpack } = useSandpack();

  const error = computed(() => sandpack.error ?? { message: '' } as SandpackError);

  return error;
};
