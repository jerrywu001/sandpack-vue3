/**
 * vite build finished, and emited asstets
 * @param callback (config) => void
 */
export default function CopyDts(callback: (config) => void) {
  let config;

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
