import Vue from 'vue';
import VueRouter, {
  RouteConfig,
} from 'vue-router';

import App from './components/App.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path      : '/',
    component : App,
  },
];

export function createRouter() {
  return new VueRouter({
    mode : 'history',
    routes,
  });
}
