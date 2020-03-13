import Vue from 'vue';
import Skyline from 'skyline';
import router from '../router';
import App from './app.vue';

/*
* import either one of below but never both
*/

// import 'skyline/style/skyline.scss';
import 'skyline/style/skyline.ios.scss';
// import 'skyline/style/skyline.md.scss';

// import style bundle
import 'skyline/style/skyline.bundle.scss';

import 'skyline/iconfont/material-icons.scss';
// TODO menu-content
import 'skyline/style/core.scss';


Vue.use(Skyline);


Object.assign(window, { router }); // router 对象注入 window

new Vue({
  router,
  render : h => h(App),
}).$mount('#app');
