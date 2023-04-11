import { ASTRO_TEMPLATE } from './node/astro';
import { VITE_LIT_TEMPLATE } from './node/vite-lit';
import { NEXTJS_TEMPLATE } from './node/nexjs';
import { NODE_TEMPLATE } from './node/node';
import { VITE_SOLID_TEMPLATE } from './node/solid';
import { VITE_TEMPLATE } from './node/vite';
import { VITE_REACT_TEMPLATE } from './node/vite-react';
import { VITE_REACT_TS_TEMPLATE } from './node/vite-react-ts';
import { VITE_SVELTE_TEMPLATE } from './node/vite-svelte';
import { VITE_SVELTE_TS_TEMPLATE } from './node/vite-svelte-ts';
import { VITE_VUE_TEMPLATE } from './node/vite-vue';
import { VITE_VUE_TS_TEMPLATE } from './node/vite-vue-ts';
import { ANGULAR_TEMPLATE } from './runtime/angular';
import { REACT_TEMPLATE } from './runtime/react';
import { REACT_TYPESCRIPT_TEMPLATE } from './runtime/react-typescript';
import { SOLID_TEMPLATE } from './runtime/solid';
import { SVELTE_TEMPLATE } from './runtime/svelte';
import { TEST_TYPESCRIPT_TEMPLATE } from './runtime/tests-ts';
import { VANILLA_TEMPLATE } from './runtime/vanilla';
import { VANILLA_TYPESCRIPT_TEMPLATE } from './runtime/vanilla-typescript';
import { VUE_TEMPLATE } from './runtime/vue';
import { VUE_TS_TEMPLATE } from './runtime/vue-ts';
import { VUE2_TEMPLATE } from './runtime/vue2';
import { VUE2_TS_TEMPLATE } from './runtime/vue2-ts';
import { STATIC_TEMPLATE } from './static';

export { VITE_TEMPLATE } from './node/vite';
export { VITE_REACT_TEMPLATE } from './node/vite-react';
export { VITE_REACT_TS_TEMPLATE } from './node/vite-react-ts';
export { VITE_SVELTE_TEMPLATE } from './node/vite-svelte';
export { VITE_SVELTE_TS_TEMPLATE } from './node/vite-svelte-ts';
export { VITE_VUE_TEMPLATE } from './node/vite-vue';
export { VITE_VUE_TS_TEMPLATE } from './node/vite-vue-ts';
export { ANGULAR_TEMPLATE } from './runtime/angular';
export { REACT_TEMPLATE } from './runtime/react';
export { REACT_TYPESCRIPT_TEMPLATE } from './runtime/react-typescript';
export { SOLID_TEMPLATE } from './runtime/solid';
export { SVELTE_TEMPLATE } from './runtime/svelte';
export { TEST_TYPESCRIPT_TEMPLATE } from './runtime/tests-ts';
export { VANILLA_TEMPLATE } from './runtime/vanilla';
export { VANILLA_TYPESCRIPT_TEMPLATE } from './runtime/vanilla-typescript';
export { VUE_TEMPLATE } from './runtime/vue';
export { VUE_TS_TEMPLATE } from './runtime/vue-ts';
export { VUE2_TEMPLATE } from './runtime/vue2';
export { VUE2_TS_TEMPLATE } from './runtime/vue2-ts';

export const SANDBOX_TEMPLATES = {
  // runtime
  react: REACT_TEMPLATE,
  'react-ts': REACT_TYPESCRIPT_TEMPLATE,
  vue2: VUE2_TEMPLATE,
  'vue2-ts': VUE2_TS_TEMPLATE,
  vue: VUE_TEMPLATE,
  'vue-ts': VUE_TS_TEMPLATE,
  vue3: VUE_TEMPLATE,
  'vue3-ts': VUE_TS_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
  'vanilla-ts': VANILLA_TYPESCRIPT_TEMPLATE,
  static: STATIC_TEMPLATE,
  angular: ANGULAR_TEMPLATE,
  svelte: SVELTE_TEMPLATE,
  solid: SOLID_TEMPLATE,
  'test-ts': TEST_TYPESCRIPT_TEMPLATE,
  // node
  node: NODE_TEMPLATE,
  nextjs: NEXTJS_TEMPLATE,
  vite: VITE_TEMPLATE,
  'vite-react': VITE_REACT_TEMPLATE,
  'vite-react-ts': VITE_REACT_TS_TEMPLATE,
  'vite-vue': VITE_VUE_TEMPLATE,
  'vite-vue-ts': VITE_VUE_TS_TEMPLATE,
  'vite-svelte': VITE_SVELTE_TEMPLATE,
  'vite-svelte-ts': VITE_SVELTE_TS_TEMPLATE,
  'vite-solid': VITE_SOLID_TEMPLATE,
  'vite-lit': VITE_LIT_TEMPLATE,
  astro: ASTRO_TEMPLATE,
};
