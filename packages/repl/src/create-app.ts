import Vue from 'vue';
import { createRouter } from './router';
import { createModel } from './model';
import App from './components/repl/Repl.vue';

Vue.mixin({
  beforeCreate() {
    this.$tr = (val: string) => val;
  },
});

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const kom = createModel();
  const app = new Vue({
    kom,
    router,
    render: (h) => h(App),
  });

  return {
    app,
    kom,
    router,
  };
}
