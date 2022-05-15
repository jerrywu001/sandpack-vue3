/// <reference types="vitest" />

import dts from 'vite-plugin-dts';
import path from 'path';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, './src')}/`,
      '#/': `${path.resolve(__dirname, './dist')}/`,
      'codesandbox-sandpack-vue3': path.resolve(__dirname, './src/index.ts'),
    },
  },
  esbuild: {
    minify: true,
  },
  build: {
    lib: {
      fileName: (type) => {
        if (type === 'es') return 'esm/index.js';
        if (type === 'cjs') return 'index.js';
        return 'index.js';
      },
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    // sourcemap: true,
    rollupOptions: {
      external: [
        'vue',
        '@codemirror/closebrackets',
        '@codemirror/commands',
        '@codemirror/comment',
        '@codemirror/gutter',
        '@codemirror/highlight',
        '@codemirror/history',
        '@codemirror/lang-css',
        '@codemirror/lang-html',
        '@codemirror/lang-javascript',
        '@codemirror/matchbrackets',
        '@codemirror/state',
        '@codemirror/view',
        '@codesandbox/sandpack-client',
      ],
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    vueJsx(),
    // https://www.npmjs.com/package/vite-plugin-dts
    dts({
      include: 'src',
      rollupTypes: true,
      afterBuild: () => {
        // do something else
      },
    }),
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
