import { computed, Ref } from 'vue';
import { useSandpack } from '../contexts/sandpackContext';

/**
 * This returns the current state of the active file
 * and a method to update its content.
 *
 * @category Hooks
 */
export const useActiveCode = (): {
  code: Ref<string>;
  readOnly: Ref<boolean>;
} => {
  const { sandpack } = useSandpack();

  const code = computed(() => (sandpack?.files[sandpack.activePath]?.code));
  const readOnly = computed(() => (sandpack?.files[sandpack.activePath]?.readOnly ?? false));

  return {
    code,
    readOnly,
  };
};
