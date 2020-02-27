import Vue from 'vue';
import { App } from 'skyline';

// import style bundle
// import 'skyline/style/skyline.bundle.scss';

/*
 * import either one of below but never both
 */

// import 'skyline/themes/skyline.components.scss';
// import 'skyline/themes/skyline.components.ios.scss';
// import 'skyline/themes/skyline.components.md.scss';

Vue.use(App);

new Vue({
  render : h => h('div', 'playground'),
}).$mount('#app');
