module.exports = (api, options) => {
  api.chainWebpack(config => {
    // disable typescipt checker if you think it's ignoring
    // we will fix it out later
    if (api.hasPlugin('typescript')) {
      config.plugins.delete('fork-ts-checker');
    }

    if (process.env.TARGET) {
      const packagesDir = api.resolve('packages');
      const packageDir = `${ packagesDir }/${ process.env.TARGET }`;

      const tapBabel = (rule) => {
        config.module.rule(rule)
          .use('babel-loader')
          .tap((options) => {
            return {
              ...options,
              babelrc  : false,
              root     : packageDir,
              rootMode : 'upward',
            };
          });
      };

      if (api.hasPlugin('babel')) {
        tapBabel('js');

        if (api.hasPlugin('typescript')) {
          tapBabel('ts');
        }
      }
    }

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
  });
};
