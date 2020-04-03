import Vue from 'vue';
import App from './App.vue';
import router from '../router';

// import '@/style/var.scss';
// import { setupTapClick } from '@/utils/tap-click';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
