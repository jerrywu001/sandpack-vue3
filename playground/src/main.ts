import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// @ts-ignore
import routes from 'virtual:generated-pages'; // 类似于router

import SanpackPlugin from 'sandpack-vue3';

import App from './App.vue';

import 'virtual:windi.css';
import './styles/main.css';
import './index.css';

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
app.use(router);
app.use(SanpackPlugin());
app.mount('#app');
