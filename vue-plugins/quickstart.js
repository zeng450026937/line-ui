const qs = require('querystring');

module.exports = (api, options) => {
  api.registerCommand(
    'quickstart',
    {
      description : 'serve quickstart',
      usage       : 'vue-cli-service quickstart',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      const target = 'quick-start';
      const packagesDir = api.resolve('packages');
      const packageDir = `${ packagesDir }/${ target }`;

      process.env.TARGET = target;

      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(`${ packageDir }/src/index.ts`);

        // auto import
        config.module.rule('vue')
          .use('skyline-auto-import')
          .loader(require.resolve('@skyline/webpack-loader-auto-import'))
          .options(require('skyline/dist/import.config.json'))
          .after('vue-loader');

        config.module.rules.delete('svg');

        // config.module
        //   .rule('svg-component')
        //   .resourceQuery(query => {
        //     const parsed = qs.parse(query.slice(1));
        //     return parsed.component != null;
        //   })
        //   .use('svg-pitcher')
        //   .loader(require.resolve('@skyline/webpack-loader-svg-component/pitcher'));

        // config.module
        //   .rule('svg')
        //   .test(/\.(svg)(\?.*)?$/)
        // .use('babel-loader')
        // .loader(require.resolve('babel-loader'))
        // .end()
        // .use('svg-component')
        // .loader(require.resolve('@skyline/webpack-loader-svg-component'));

        // config.module
        //   .rule('svg')
        //   .test(/\.(svg)(\?.*)?$/)
        //   .use('svg-symbol')
        //   .loader(require.resolve('@skyline/webpack-loader-svg-symbol'));

        // config
        //   .plugin('svg-symbol')
        //   .use(require('@skyline/webpack-loader-svg-symbol/plugin'));

        config.module
          .rule('svg')
          .test(/\.(svg)(\?.*)?$/)
          .use('svg-symbol')
          .loader(require.resolve('@skyline/webpack-plugin-svg-sprite/lib/loader'))
          .options({});

        config
          .plugin('svg-symbol')
          .use(require('@skyline/webpack-plugin-svg-sprite'));

        // config.module
        //   .rule('svg')
        //   .test(/\.(svg)(\?.*)?$/)
        //   .use('svg-symbol')
        //   .loader(require.resolve('svg-sprite-loader/lib/loader'))
        //   .options({ extract: true });

        // config
        //   .plugin('svg-symbol')
        //   .use(require('svg-sprite-loader/lib/plugin'));

        // auto import
      //   config.module.rule('ts')
      //     .use('ts-loader')
      //     .tap(options => {
      //       return {
      //         ...options,
      //         getCustomTransformers : () => ({
      //           before : [require('@skyline/ts-auto-import')()],
      //         }),
      //       };
      //     });
      });

      api.service.run('serve', args, rawArgs);
    },
  );
};

module.exports.defaultModes = {
  quickstart : 'development',
};
