import { createApp } from './src/create-app';

/* eslint-disable prefer-promise-reject-errors */
export default (ssrContext: any) => {
  // since there could potentially be asynchronous route hooks or components,
  // we will be returning a Promise so that the server can wait until
  // everything is ready before rendering.

  return new Promise((resolve, reject) => {
    const { app, router } = createApp(ssrContext);

    const { fullPath } = router.resolve(ssrContext.url).route;

    if (fullPath !== ssrContext.url) {
      reject({ url: fullPath });
    }

    // set server-side router's location
    router.push(ssrContext.url);

    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        reject({ code: 404 });
        return;
      }

      // the Promise should resolve to the app instance so it can be rendered
      // ssrContext.$getMetaHTML = app.$getMetaHTML(app);
      resolve(app);
    }, reject);
  });
};
