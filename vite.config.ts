/// <reference types="vitest" />

import path from 'path';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import shelljs from 'shelljs';
import AfterBuild from './scripts/after-build';
import pkg from './package.json';

const removeCss = require('./scripts/rollup-remove-css-transformer');

const resolvePath = (pathName: string) => path.resolve(__dirname, pathName);

export default defineConfig({
  resolve: {
    alias: {
      'sandpack-vue3': resolvePath('./src/index.ts'),
    },
  },
  define: {
    __UNSTYLED_COMPONENTS__: true,
  },
  build: {
    target: ['chrome52'],
    minify: true,
    lib: {
      fileName: (type) => {
        if (type === 'es') return 'unstyled.mjs';
        if (type === 'cjs') return 'unstyled.js';
        return 'unstyled.cjs';
      },
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    emptyOutDir: false,
    outDir: path.resolve(__dirname, 'dist'),
    // sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.devDependencies),
        ...Object.keys(pkg.peerDependencies),
      ],
      plugins: [
        removeCss(),
      ],
    },
  },
  plugins: [
    Vue(),
    vueJsx(),
    AfterBuild(() => {
      shelljs.cp(resolvePath('./dist/index.d.ts'), resolvePath('./dist/unstyled.d.ts'));
    }),
  ],
  // https://github.com/vitest-dev/vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
  },
});
