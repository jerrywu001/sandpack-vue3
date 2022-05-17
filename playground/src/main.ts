import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from 'virtual:generated-pages';

import SanpackPlugin from 'codesandbox-sandpack-vue3';

import App from './App.vue';

import '@unocss/reset/tailwind.css';
import 'virtual:windi.css';
import 'uno.css';
import './styles/main.css';
import './index.css';

// eslint-disable-next-line import/no-relative-packages
import '../../src/styles/index.css';

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
app.use(router);
app.use(SanpackPlugin());
app.mount('#app');
