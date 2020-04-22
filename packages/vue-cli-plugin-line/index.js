module.exports = (api, options) => {
  api.chainWebpack((config) => {
    let configuration;
    try {
      configuration = require(api.resolve('line.config.js'));
    } catch (error) {
      configuration = options['line-ui'] || {};
    }
    const {
      autoimport = true,
      svgsprite: spritePluginOptions = {},
      svgcomponent = false,
      i18n: i18nPluginOptions = {},
      config: configPluginOptions = {},
    } = configuration;

    if (autoimport) {
      config.module
        .rule('vue')
        .use('line-auto-import')
        .loader(require.resolve('@line-ui/webpack-loader-auto-import'))
        .options(require('@line-ui/line/import.config'))
        .after('vue-loader');
    }

    if (spritePluginOptions) {
      config.module.rules.delete('svg');

      config.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('svg-sprite')
        .loader(
          require.resolve('@line-ui/webpack-plugin-svg-sprite/lib/loader')
        );

      const userOptions =
        typeof spritePluginOptions === 'object' ? spritePluginOptions : {};

      config
        .plugin('svg-sprite')
        .use(require('@line-ui/webpack-plugin-svg-sprite'), [userOptions]);
    } else if (svgcomponent) {
      if (api.hasPlugin('babel')) {
        config.module.rules.delete('svg');

        config.module
          .rule('svg')
          .test(/\.(svg)(\?.*)?$/)
          // .use('babel-loader')
          // .loader(require.resolve('babel-loader'))
          // .end()
          .use('svg-component')
          .loader(require.resolve('@line-ui/webpack-loader-svg-component'));
      } else {
        console.log('svg-component require babel-loader with jsx support.');
      }
    }

    const fs = require('fs');

    if (i18nPluginOptions) {
      const userOptions =
        typeof i18nPluginOptions === 'object' ? i18nPluginOptions : {};
      const ext = api.hasPlugin('typescript') ? 'ts' : 'js';
      const runtime = api.resolve(`src/i18n-runtime.${ext}`);
      const hasRuntime = fs.existsSync(runtime);
      const finalOptions = hasRuntime
        ? { runtime, ...userOptions }
        : { ...userOptions };
      config
        .plugin('i18n')
        .use(require('@line-ui/webpack-plugin-i18n'), [finalOptions]);
    }
    if (configPluginOptions) {
      const userOptions =
        typeof configPluginOptions === 'object' ? configPluginOptions : {};
      const ext = api.hasPlugin('typescript') ? 'ts' : 'js';
      const runtime = api.resolve(`src/config-runtime.${ext}`);
      const hasRuntime = fs.existsSync(runtime);
      const finalOptions = hasRuntime
        ? { runtime, ...userOptions }
        : { ...userOptions };
      config
        .plugin('config')
        .use(require('@line-ui/webpack-plugin-config'), [finalOptions]);
    }
  });
};
