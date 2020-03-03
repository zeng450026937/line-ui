import Vue from 'vue';
import Skyline from 'skyline';
import router from '../router';
import App from './app.vue';


// import style bundle
import 'skyline/style/skyline.bundle.scss';

/*
 * import either one of below but never both
 */

// import 'skyline/themes/skyline.components.scss';
import 'skyline/themes/skyline.components.ios.scss';
// import 'skyline/themes/skyline.components.md.scss';
// import 'skyline/themes/skyline.globals.ios.scss';

import 'skyline/iconfont/material-icons.scss';


// import 'skyline/components/button/button.scss';
// import 'skyline/components/button/button.ios.scss';

Vue.use(Skyline);


Object.assign(window, { router }); // router 对象注入 window

new Vue({
  router,
  render : h => h(App),
}).$mount('#app');
