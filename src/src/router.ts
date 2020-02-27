import Vue from 'vue';
import VueRouter, {
  RouteConfig,
} from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [];

export function createRouter() {
  return new VueRouter({
    mode : 'history',
    routes,
  });
}
