import Vue from 'vue';
import { createRouter } from './router';
import App from './components/App.vue';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const app = new Vue({
    router,
    render: (h) => h(App),
  });

  return {
    app,
    router,
  };
}
