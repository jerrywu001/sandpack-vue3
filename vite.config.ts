/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, './src')}/`,
      '#/': `${path.resolve(__dirname, './dist')}/`,
      '@codesandbox/sandpack-vue3': path.resolve(__dirname, './src/index.ts'),
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
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
})
