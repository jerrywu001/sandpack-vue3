<img style="width:100%" src="https://user-images.githubusercontent.com/4838076/143581035-ebee5ba2-9cb1-4fe8-a05b-2f44bd69bb4b.gif" alt="Component toolkit for live running code editing experiences" />

# Sandpack Vue3

Vue3 components that give you the power of editable sandboxes that run in the browser.

```jsx
import { Sandpack } from "codesandbox-sandpack-vue3";
import "codesandbox-sandpack-vue3/dist/index.css";

<Sandpack template="vue3" />;
```

[Read more](https://sandpack.codesandbox.io/)

## Documentation

For full documentation, visit [https://sandpack.codesandbox.io/docs/](https://sandpack.codesandbox.io/docs/)

**This project removes devtools component**

## online demo

[demo](https://stackblitz.com/edit/vitejs-vite-s6jdds)

[ssg demo](https://stackblitz.com/edit/vitejs-vite-ha17a9)

*Here's an example of a react version for comparison*

https://stackblitz.com/edit/vitejs-vite-axyaxx


## SSG/SSR

Use [vitepress](https://vitepress.vuejs.org/)/[quasar](https://quasar.dev/start/pick-quasar-flavour)

## Tips ☕

*When using vue, please do not write it that way*, It will not take effect

```jsx
// 💀
<div style={{ height: 200 }}>

// 💀
<SandpackPreview
  customStyle={{ width: 400, height: 300 }}
/>
```

👉🏽**Write it like this**

```jsx
<div style={{ height: '200px' }}>

<SandpackPreview
  customStyle={{ width: '400px', height: '300px' }}
/>
```

## install

```bash
npm i

npm run play
```

> If .tsx file has a type error about JSX (The storybook relies on @types/react), Please delete the @types/react.

```bash
rm -rf node_modules/@types/react
```

## Supported browsers

npx browserslist
