import Vue from 'vue';
import App from './App.vue';
import './style/reset.scss';
import './style/ui.scss';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
