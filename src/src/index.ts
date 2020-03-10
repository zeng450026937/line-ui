import Vue from 'vue';
import Skyline from 'skyline';
import App from '../components/App.vue';
import { createRouter } from './router';

// import style bundle
// import 'skyline/style/skyline.bundle.scss';

/*
 * import either one of below but never both
 */

// import 'skyline/style/skyline.scss';
// import 'skyline/style/skyline.ios.scss';
// import 'skyline/style/skyline.md.scss';

Vue.use(Skyline);

console.log(Skyline);

const version = '1.0.0'; // Skyline.version;

export function createApp(context?: any /* ssr context */) {
  const router = createRouter();
  const app = new Vue({
    router,
    render : h => h('div', [`SKYLINE ${ version }`, h(App)]),
  });

  return {
    app,
    router,
  };
}
