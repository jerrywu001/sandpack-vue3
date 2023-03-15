/// <reference types="vitest" />

import path from 'path';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import pkg from './package.json';

const removeCss = require('./scripts/rollup-remove-css-transformer');

export default defineConfig({
  resolve: {
    alias: {
      'sandpack-vue3': path.resolve(__dirname, './src/index.ts'),
    },
  },
  define: {
    __UNSTYLED_COMPONENTS__: true,
  },
  build: {
    minify: true,
    lib: {
      fileName: (type) => {
        if (type === 'es') return 'esm/index.js';
        if (type === 'cjs') return 'index.js';
        return 'index.js';
      },
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    outDir: path.resolve(__dirname, 'dist/unstyled'),
    // sourcemap: true,
    rollupOptions: {
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
  ],
  // https://github.com/vitest-dev/vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    transformMode: {
      web: [/.[tj]sx$/],
    },
  },
});
