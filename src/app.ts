import { createApp } from './src/create-app';

const { app, router } = createApp();

router.onReady(() => {
  app.$mount('#app');
});
