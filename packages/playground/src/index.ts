import Vue from 'vue';
import Skyline from 'skyline';
import { createRouter } from './router';

// import style bundle
import 'skyline/style/skyline.bundle.scss';

/*
 * import either one of below but never both
 */

// import 'skyline/themes/skyline.components.scss';
import 'skyline/themes/skyline.components.ios.scss';
// import 'skyline/themes/skyline.components.md.scss';

Vue.use(Skyline);

export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const app = new Vue({
    router,
    render : h => h('line-app', 'playground'),
  });

  return {
    app,
    router,
  };
}
