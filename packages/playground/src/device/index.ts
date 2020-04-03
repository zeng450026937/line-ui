import Vue from 'vue';
import Skyline from 'skyline/src';
import router from '../router';
import App from './app.vue';

/*
 * import either one of below but never both
 */

// import 'skyline/style/skyline.scss';
import 'skyline/src/style/skyline.ios.scss';
// import 'skyline/style/skyline.md.scss';

// import style bundle
import 'skyline/src/style/skyline.bundle.scss';

import 'skyline/src/iconfont/material-icons.scss';
// TODO menu-content
import 'skyline/src/style/core.scss';

// import 'skyline/src/themes/css-variables/css/dark.css';
// import 'skyline/src/themes/css-variables/css/default.css';
// import 'skyline/src/themes/css-variables/css/oceanic.css';
// import 'skyline/src/themes/css-variables/css/toolbar.css';
// import 'skyline/src/themes/css-variables/css/vibrant.css';

Vue.use(Skyline);

Object.assign(window, { router }); // router 对象注入 window

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
