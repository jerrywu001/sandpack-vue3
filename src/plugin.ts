import type { Plugin } from 'vue';
import { SandpackInitOptions } from './components';

export function SanpackPlugin(defaultOptions = {} as SandpackInitOptions): Plugin {
  return {
    install(app) {
    },
  };
}
