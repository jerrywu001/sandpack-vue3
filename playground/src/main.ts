import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from 'virtual:generated-pages';

import SanpackPlugin from '@codesandbox/sandpack-vue3';
// for dist index.mjs (npm run dev [and] npm run play)
// import SanpackPlugin from '#/index';

import App from './App.vue';

import '@unocss/reset/tailwind.css';
import './styles/main.css';
import 'uno.css';
import './index.css';

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
app.use(router);
app.use(SanpackPlugin());
app.mount('#app');
