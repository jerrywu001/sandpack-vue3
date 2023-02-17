import { commonFiles } from '../common';

/**
 * @hidden
 */
export const ASTRO_TEMPLATE = {
  files: {
    '/src/styles.css': commonFiles['/styles.css'],
    '/src/pages/index.astro': {
      code: `---
import "../styles.css";
const data = "world";
---

<h1>Hello {data}</h1>

<style>
  h1 {
    font-size: 1.5rem;
  }
</style>`,
    },
    '/src/env.d.ts': {
      code: '/// <reference types="astro/client" />',
    },
    '.env': {
      code: 'ASTRO_TELEMETRY_DISABLED="1"',
    },
    '/astro.config.mjs': {
      code: `import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});`,
    },
    '/tsconfig.json': {
      code: `{
  "extends": "astro/tsconfigs/base"
}`,
    },
    '/package.json': {
      code: JSON.stringify({
        dependencies: {
          astro: '^1.9.2',
          'esbuild-wasm': '0.17.10',
        },
        scripts: {
          dev: 'astro dev',
          start: 'astro dev',
          build: 'astro build',
          preview: 'astro preview',
          astro: 'astro',
        },
      }, null, 2),
    },
  },
  main: '/src/pages/index.astro',
  environment: 'node',
};
