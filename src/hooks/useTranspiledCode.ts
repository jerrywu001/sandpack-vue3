import { Ref, ref } from 'vue';
import { useSandpack } from '../contexts/sandpackContext';
import type { SandpackState } from '../types';

function getTranspiledCode(sandpack: SandpackState): string | null {
  const { activePath, bundlerState } = sandpack;
  if (bundlerState == null) {
    return null;
  }

  const tModule = bundlerState.transpiledModules[activePath + ':'];
  return tModule?.source?.compiledCode ?? null;
}

/**
 * @category Hooks
 */
export const useTranspiledCode = (): Ref<string> => {
  const { sandpack } = useSandpack();
  const code = ref('');

  if (sandpack.status === 'running') {
    code.value = getTranspiledCode(sandpack) || '';
  }

  return code;
};
