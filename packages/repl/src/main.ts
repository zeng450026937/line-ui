import { createApp } from './create-app';
import './usages';

const { app, router } = createApp();

router.onReady(() => {
  app.$mount('#app');
});
