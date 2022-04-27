import { defineConfig } from 'tsup';
import babel from 'esbuild-plugin-babel';

// https://tsup.egoist.sh/
// https://esbuild.github.io/

export default defineConfig({
  name: 'tsup',
  entry: [
    './src/index.ts',
    './src/components/**/*',
  ],
  target: 'es6',
  format: ['cjs', 'esm'],
  shims: false,
  clean: true,
  dts: true,
  sourcemap: true,
  minify: true,
  esbuildPlugins: [
    babel(),
  ],
});
