import { useSandpack } from '../contexts/sandpackContext';
import { computed, ComputedRef, onMounted } from 'vue';
import { SandpackError } from '@codesandbox/sandpack-client';

/**
 * @category Hooks
 */
export const useErrorMessage = (): ComputedRef<SandpackError> => {
  const { sandpack } = useSandpack();

  const error = computed(() => sandpack.error ?? { message: '' } as SandpackError);

  onMounted(() => {
    sandpack.errorScreenRegisteredRef = true;
  });

  return error;
};
