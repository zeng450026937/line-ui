import Vue from 'vue';
import App from './App.vue';
// TODO:
// Move var.scss to somewhere else, maybe move to theme default ?
import '@/style/var.scss';
import '@/style/skyline.bundle.scss';
import '@/style/animation.scss';
import '@/themes/skyline.globals.scss';
// import '@/themes/skyline.globals.ios.scss';

import SkyLine from '@/index';

Vue.use(SkyLine);


Vue.config.productionTip = false;

new Vue({
  render : h => h(App),
}).$mount('#app');
