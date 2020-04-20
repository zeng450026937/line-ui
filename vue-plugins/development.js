const fs = require('fs');

module.exports = (api, options) => {
  require('@line-ui/vue-cli-plugin-line')(api, options);

  api.chainWebpack((config) => {
    // disable typescipt checker if you think it's ignoring
    // we will fix it out later
    if (api.hasPlugin('typescript')) {
      config.plugins.delete('fork-ts-checker');
    }

    if (process.env.TARGET) {
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
