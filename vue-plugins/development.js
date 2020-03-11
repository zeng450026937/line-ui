module.exports = (api, options) => {
  // for development, set "skyline" alias to source code
  // config.resolve.alias
  //   .set('skyline', api.resolve('packages/skyline/src'));

  // auto import
  // config.module.rule('vue')
  //   .use('skyline-auto-import')
  //   .loader(api.resolve('packages/webpack-loader-auto-import/src/index.js'))
  //   // check kebab case
  //   .options('kebab')
  //   .after('vue-loader');

  // config.module.rule('import')
  //   .resourceQuery('blockType=import')
  //   .use('skyline-auto-import')
  //   .loader(api.resolve('packages/webpack-loader-auto-import/src/import.js'))
  //   .after('babel-loader')
  //   .end();
};
