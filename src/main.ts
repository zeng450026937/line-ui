import Vue from 'vue';
import App from './App.vue';
import './style/reset.scss';
import './style/ui.scss';
import { setupTapClick } from './utils/tap-click';

Vue.config.productionTip = false;

setupTapClick({});

new Vue({
  render: h => h(App),
}).$mount('#app');
