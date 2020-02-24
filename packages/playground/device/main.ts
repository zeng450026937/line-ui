import Vue from 'vue';
import Skyline from '@/main';
import App from './app.vue';
import router from '../router';

Vue.use(Skyline);
Vue.config.productionTip = false;

Object.assign(window, { router }); // router 对象注入 window

new Vue({
  router,
  render : h => h(App),
}).$mount('#app');
