import Vue from 'vue';
import Skyline from 'skyline';
import { createRouter } from './router';

Vue.use(Skyline);

const { version } = Skyline;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const app = new Vue({
    router,
    render : h => h(
      'div',
      { domProps: { id: 'app' } },
      [`SKYLINE ${ version }`, h('router-view')],
    ),
  });

  return {
    app,
    router,
  };
}
