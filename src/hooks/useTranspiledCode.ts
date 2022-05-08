import { computed, Ref, ref } from 'vue';
import { useSandpack } from '../contexts/sandpackContext';

/**
 * useTranspiledCode
 */
export const useTranspiledCode = (): Ref<string> => {
  const code = ref('');
  const { sandpack } = useSandpack();
  const transpiledCode = computed(() => {
    if (sandpack.bundlerState == null) {
      return '';
    }

    const tModule = sandpack.bundlerState?.transpiledModules[sandpack.activePath + ':'];
    return tModule?.source?.compiledCode ?? '';
  });

  if (sandpack.status === 'running') {
    code.value = transpiledCode.value;
  }

  return code;
};
