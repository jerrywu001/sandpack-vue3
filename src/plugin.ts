import type { Plugin } from 'vue';
import { Sandpack } from './components/sand-pack/Sandpack';
import type { SandpackInitOptions } from './types';

export function SanpackPlugin(defaultOptions = {} as SandpackInitOptions): Plugin {
  return {
    install(app) {
      app.component('Sandpack', Sandpack);
    },
  };
}
