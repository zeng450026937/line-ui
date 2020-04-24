const fs = require('fs');

module.exports = (api, options) => {
  process.env.VUE_APP_TITLE = 'LINE SPA';

  if (process.env.LINE_CLI !== false) {
    require('@line-ui/vue-cli-plugin-line')(api, options);
  }

  api.chainWebpack((config) => {
    // disable typescipt checker if you think it's ignoring
    // we will fix it out later
    if (api.hasPlugin('typescript')) {
      config.plugins.delete('fork-ts-checker');
    }

    if (process.env.TARGET) {
      process.env.VUE_APP_TITLE = process.env.TARGET.toUpperCase();

      const packagesDir = api.resolve('packages');
      const packageDir = `${packagesDir}/${process.env.TARGET}`;

      config.resolve.alias.set('@', packageDir);

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

      config.entry('app').clear().add(`${packageDir}/src/main.ts`);

      const htmlFile = `${packageDir}/index.html`;
      const tapHTML = () => {
        config.plugin('html').tap((args) => {
          args[0].template = htmlFile;
          return args;
        });
      };

      if (fs.existsSync(htmlFile)) {
        tapHTML();
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
    }
  });
};
