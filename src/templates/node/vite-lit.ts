import { commonFiles } from '../common';

export const VITE_LIT_TEMPLATE = {
  files: {
    ...commonFiles,
    '/styles.css': commonFiles['/styles.css'],
    '/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Lit + TS</title>
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/main.ts"></script>
  </head>
  <body>
    <my-element />
  </body>
</html>
`,
    },
    '/main.ts': {
      code: `import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('my-element')
export class MyElement extends LitElement {
  @property()
  msg = 'Hello world'

  render() {
    return html\`<h1>\${this.msg}</h1>\`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
`,
    },
    '/vite-env.d.ts': {
      code: '/// <reference types="vite/client" />',
    },
    '/tsconfig.json': {
      code: `{
  "compilerOptions": {
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./types",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "Node",
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": false,
    "skipLibCheck": true
  },
  "references": [{ "path": "./tsconfig.node.json" }]
}
`,
    },
    '/tsconfig.node.json': {
      code: `{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`,
    },
    '/vite.config.ts': {
      code: `import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: '/main.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
})
`,
    },
    '/package.json': {
      code: `{
  "name": "vite-lit",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "lit": "^2.7.4"
  },
  "devDependencies": {
    "typescript": "^5.0.4",
    "vite": "4.2.2",
    "esbuild-wasm": "^0.17.19"
  }
}
`,
    },
  },
  entry: '/main.ts',
  main: '/main.ts',
  environment: 'node',
};
