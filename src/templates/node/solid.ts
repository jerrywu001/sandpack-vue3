import { commonFiles } from '../common';

export const VITE_SOLID_TEMPLATE = {
  files: {
    ...commonFiles,
    '/App.tsx': {
      code: `import { Component } from "solid-js";

const App: Component = () => {
  return <h1>Hello world</h1>
};

export default App;`,
    },
    '/index.tsx': {
      code: `import { render } from "solid-js/web";
import App from "./App";

import "./styles.css";

render(() => <App />, document.getElementById("app"));`,
    },
    '/index.html': {
      code: `<html>
<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`,
    },
    '/vite.config.ts': {
      code: `/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});`,
    },
    '/tsconfig.json': {
      code: `{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client", "@testing-library/jest-dom"]
  }
}`,
    },
    '/package.json': {
      code: JSON.stringify({
        type: 'module',
        scripts: {
          dev: 'vite --force',
          build: 'tsc && vite build',
          serve: 'vite preview',
        },
        dependencies: {
          'solid-js': '^1.6.15',
        },
        devDependencies: {
          vite: '4.0.0',
          typescript: '^5.0.2',
          'vite-plugin-solid': '^2.6.1',
          'esbuild-wasm': '^0.17.12',
        },
        main: '/index.tsx',
      }, null, 2),
    },
  },
  main: '/App.tsx',
  environment: 'node',
};
