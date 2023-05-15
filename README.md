<img style="width:100%" src="https://user-images.githubusercontent.com/4838076/143581035-ebee5ba2-9cb1-4fe8-a05b-2f44bd69bb4b.gif" alt="Component toolkit for live running code editing experiences" />

# Sandpack Vue3

Vue3 components that give you the power of editable sandboxes that run in the browser.

```jsx
import { Sandpack } from 'sandpack-vue3';

<Sandpack template="vue3" />;
```

Frome 3.0, we add some new templates:

[Quickstart](https://sandpack.codesandbox.io/docs/quickstart#preview)

`node nextjs vite vite-react vite-react-ts vite-vue vite-vue-ts vite-svelte vite-svelte-ts vite-solid vite-lit astro`

[Read more](https://sandpack.codesandbox.io/)

## online demo

[demo](https://stackblitz.com/edit/vitejs-vite-s6jdds)

[ssg demo](https://stackblitz.com/edit/vitejs-vite-ha17a9)

*Here's an example of a react version for comparison*

https://stackblitz.com/edit/vitejs-vite-axyaxx

## releases

https://github.com/jerrywu001/sandpack-vue3/releases

## Sandpack Themes

A list of themes to customize your Sandpack components.

```jsx
import { githubLight } from "@codesandbox/sandpack-themes";

<Sandpack theme={githubLight} />;
```

[Read more](https://sandpack.codesandbox.io/docs/getting-started/themes)

## Documentation

For full documentation, visit [https://sandpack.codesandbox.io/docs/](https://sandpack.codesandbox.io/docs/)

**This project removes [devtools component && useSandpackLint hook]**


## SSG/SSR

Use [vitepress](https://vitepress.vuejs.org/)/[quasar](https://quasar.dev/start/pick-quasar-flavour)

## Register Components Globally

```js
// main.ts
import SanpackPlugin from 'sandpack-vue3';

app.use(SanpackPlugin());
```

```js
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "sandpack-vue3/global"
    ]
  }
}
```

### registe components

- [Sandpack](https://sandpack.codesandbox.io/docs/api/react/#sandpack)
- [SandpackLayout](https://sandpack.codesandbox.io/docs/api/react/interfaces/SandpackLayoutProps)
- [SandpackConsole](https://sandpack.codesandbox.io/docs/advanced-usage/components#console)
- [SandpackTests](https://sandpack.codesandbox.io/docs/advanced-usage/components#tests)
- [CodeEditor](https://sandpack.codesandbox.io/docs/api/react/#codeeditor)
- [SandpackProvider](https://sandpack.codesandbox.io/docs/api/react/classes/SandpackProvider)
- [ErrorOverlay](https://sandpack.codesandbox.io/docs/api/react/#erroroverlay)
- [LoadingOverlay](https://sandpack.codesandbox.io/docs/api/react/#loadingoverlay)
- [SandpackCodeEditor](https://sandpack.codesandbox.io/docs/api/react/#sandpackcodeeditor)
- [SandpackCodeViewer](https://sandpack.codesandbox.io/docs/api/react/#sandpackcodeviewer)
- [SandpackPreview](https://sandpack.codesandbox.io/docs/api/react/#sandpackpreview)
- [SandpackStack](https://sandpack.codesandbox.io/docs/api/react/#sandpackstack)
- [SandpackTranspiledCode](https://sandpack.codesandbox.io/docs/api/react/#sandpacktranspiledcode)
- [SandpackFileExplorer](https://sandpack.codesandbox.io/docs/api/react/#sandpackfileexplorer)

## Tips ☕

*When using vue, please do not write it that way*, It will not take effect

```jsx
// 💀
<div style={{ height: 200 }}>
```

👉🏽**Write it like this**

```jsx
<div style={{ height: '200px' }}>
```

## install

```bash
npm i

npm run storybook
```

## for nuxt3

- nuxt.config.ts

```tsx
import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  vite: {
    define: {
      'process.env.LOG': {},
    },
  },
});

```

## Supported browsers

npx browserslist
