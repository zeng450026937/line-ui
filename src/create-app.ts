import Vue from 'vue';
import Line from '@line-ui/line';
import { createRouter } from './router';

Vue.use(Line);

const { version } = Line;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const app = new Vue({
    router,
    render : h => h(
      'div',
      { domProps: { id: 'app' } },
      [`LINE-UI ${ version }`, h('router-view')],
    ),
  });

  return {
    app,
    router,
  };
}
