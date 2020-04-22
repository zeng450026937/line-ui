import { createApp } from './src/index';

const { app, router } = createApp();

router.onReady(() => {
  app.$mount('#app');
});
