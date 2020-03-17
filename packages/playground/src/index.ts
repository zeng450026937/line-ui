import Vue from 'vue';
import Skyline from 'skyline/src';
import router from './router';
import App from './app.vue';

/*
* import either one of below but never both
*/

// import 'skyline/style/skyline.scss';
import 'skyline/src/style/skyline.ios.scss';
// import 'skyline/style/skyline.md.scss';

// import style bundle
import 'skyline/src/style/skyline.bundle.scss';

// iconfont
import 'skyline/src/iconfont/material-icons.scss';
// TODO menu-content
// import 'skyline/style/core.scss';

Vue.use(Skyline);

export function createApp(context?: any /* ssr context */) {
  const app = new Vue({
    router,
    render : h => h(App),
  });

  return {
    app,
    router,
  };
}
