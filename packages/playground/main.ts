import '@/style/skyline.bundle.scss';
import '@/themes/skyline.globals.scss';
import '@/themes/skyline.globals.ios.scss';

import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render : h => h(App),
}).$mount('#app');
