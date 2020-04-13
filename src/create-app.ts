import Vue from 'vue';
import { createRouter } from './router';
import { createModel } from './model';
// import App from './components/App.vue';

createModel();

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const app = new Vue({
    router,
    render: (h) => h('div'),
  });

  return {
    app,
    router,
  };
}
