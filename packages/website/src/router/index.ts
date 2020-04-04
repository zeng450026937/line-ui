import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Header from '../components/Header.vue';
import Content from '../components/Content.vue';
import Footer from '../components/Footer.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    components: {
      header: Header,
      content: Content,
      footer: Footer,
    },
  },
];

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    routes,
  });
}
