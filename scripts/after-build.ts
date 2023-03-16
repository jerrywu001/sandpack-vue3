import type { Plugin, ResolvedConfig } from 'vite';

/**
 * vite build finished, and emited asstets
 * @param callback (config) => void
 */
export default function CopyDts(callback: (config: ResolvedConfig) => void): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'copy-dts',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    closeBundle() {
      if (config.command === 'build') {
        if (callback) {
          callback(config);
        }
      }
    },
  };
}
