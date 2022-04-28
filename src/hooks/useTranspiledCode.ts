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
export const useTranspiledCode = (): string | null => {
  const { sandpack } = useSandpack();
  if (sandpack.status !== 'running') {
    return null;
  }

  return getTranspiledCode(sandpack);
};
