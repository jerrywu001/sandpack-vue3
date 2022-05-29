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
  updateCode: (newCode: string) => void;
} => {
  const { sandpack } = useSandpack();

  const code = computed(() => (sandpack?.files[sandpack.activeFile]?.code));
  const readOnly = computed(() => (sandpack?.files[sandpack.activeFile]?.readOnly ?? false));

  return {
    code,
    readOnly,
    updateCode: sandpack.updateCurrentFile,
  };
};
