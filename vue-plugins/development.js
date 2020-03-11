module.exports = (api, options) => {
  api.chainWebpack(config => {
    if (process.env.TARGET) {
      const packagesDir = api.resolve('packages');
      const packageDir = `${ packagesDir }/${ process.env.TARGET }`;

      config.module.rule('js')
        .use('babel-loader')
        .tap(options => {
          return {
            ...options,
            babelrc  : false,
            root     : packageDir,
            rootMode : 'upward',
          };
        });
    }
  });

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
