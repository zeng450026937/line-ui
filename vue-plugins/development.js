const fs = require('fs');

module.exports = (api, options) => {
  api.chainWebpack((config) => {
    // disable typescipt checker if you think it's ignoring
    // we will fix it out later
    if (api.hasPlugin('typescript')) {
      config.plugins.delete('fork-ts-checker');
    }

    if (process.env.TARGET) {
      const packagesDir = api.resolve('packages');
      const packageDir = `${packagesDir}/${process.env.TARGET}`;

      const tapBabel = (rule) => {
        config.module
          .rule(rule)
          .use('babel-loader')
          .tap((options) => {
            return {
              ...options,
              babelrc: false,
              root: packageDir,
              rootMode: 'upward',
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

      const outputDir = api.resolve(options.outputDir);
      const publicDir = `${packageDir}/public/`;
      const tapCopy = () => {
        config.plugin('copy').tap((options) => {
          return [
            [
              ...options[0],
              {
                from: publicDir,
                to: outputDir,
                toType: 'dir',
              },
            ],
          ];
        });
      };

      if (fs.existsSync(publicDir)) {
        tapCopy();
      }

      // line config
      const line = {
        autoimport: true,
        svgsprite: true,
        svgcomponent: false,
        i18n: true,
      };

      if (line.autoimport) {
        config.module
          .rule('vue')
          .use('line-auto-import')
          .loader(require.resolve('@line-ui/webpack-loader-auto-import'))
          .options(require('@line-ui/line/import.config'))
          .after('vue-loader');
      }

      if (line.svgsprite) {
        config.module.rules.delete('svg');

        config.module
          .rule('svg')
          .test(/\.(svg)(\?.*)?$/)
          .use('svg-sprite')
          .loader(
            require.resolve('@line-ui/webpack-plugin-svg-sprite/lib/loader')
          );

        config
          .plugin('svg-sprite')
          .use(require('@line-ui/webpack-plugin-svg-sprite'));
      } else if (line.svgcomponent) {
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

      if (line.i18n) {
        config.plugin('i18n').use(require('@line-ui/webpack-plugin-i18n'));
      }
    }
  });
};
