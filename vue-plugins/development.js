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
          tapBabel('tsx');
        }
      }

      // skyline config
      const skyline = {
        autoimport   : true,
        svgsprite    : true,
        svgcomponent : false,
        i18n         : true,
      };

      if (skyline.autoimport) {
        config.module.rule('vue')
          .use('skyline-auto-import')
          .loader(require.resolve('@skyline/webpack-loader-auto-import'))
          .options(require('skyline/import.config'))
          .after('vue-loader');
      }

      if (skyline.svgsprite) {
        config.module.rules.delete('svg');

        config.module
          .rule('svg')
          .test(/\.(svg)(\?.*)?$/)
          .use('svg-sprite')
          .loader(require.resolve('@skyline/webpack-plugin-svg-sprite/lib/loader'));

        config
          .plugin('svg-sprite')
          .use(require('@skyline/webpack-plugin-svg-sprite'));
      } else if (skyline.svgcomponent) {
        if (api.hasPlugin('babel')) {
          config.module.rules.delete('svg');

          config.module
            .rule('svg')
            .test(/\.(svg)(\?.*)?$/)
            // .use('babel-loader')
            // .loader(require.resolve('babel-loader'))
            // .end()
            .use('svg-component')
            .loader(require.resolve('@skyline/webpack-loader-svg-component'));
        } else {
          console.log(
            'svg-component require babel-loader with jsx support.',
          );
        }
      }

      if (skyline.i18n) {
        config
          .plugin('i18n')
          .use(require('@skyline/webpack-plugin-i18n'));
      }
    }
  });
};
