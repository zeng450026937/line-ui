import { createApp } from './src';

const { app, router } = createApp();

router.onReady(() => {
  app.$mount('#app');
});
