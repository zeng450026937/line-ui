import Vue from 'vue';
import Skyline from 'skyline';
import router from './router';
import App from './app.vue';


// import style bundle
import 'skyline/style/skyline.bundle.scss';

/*
 * import either one of below but never both
 */

import 'skyline/themes/skyline.components.scss';
import 'skyline/themes/skyline.components.ios.scss';
// import 'skyline/themes/skyline.components.md.scss';

// iconfont
import 'skyline/iconfont/material-icons.scss';

Vue.use(Skyline);

export function createApp(context?: any /* ssr context */) {
  // const router = createRouter();
  const app = new Vue({
    router,
    render : h => h(App),
  });

  return {
    app,
    router,
  };
}
