module.exports = (api, options) => {
  api.registerCommand(
    'serve:playground',
    {
      description: 'serve payground',
      usage: 'vue-cli-service serve:playground',
      details: 'TBD',
    },
    (args, rawArgs) => {
      const target = 'playground';
      const packagesDir = api.resolve('packages');
      const packageDir = `${packagesDir}/${target}`;

      process.env.TARGET = 'playground';

      options.pages = {
        index: `${packageDir}/src/main.ts`,
        mobile: {
          entry: `${packageDir}/src/device/index.ts`,
          template: 'public/index.html',
          title: 'Mobile',
          filename: 'mobile.html',
        },
      };

      api.service.run('serve', args, rawArgs);
    }
  );

  api.registerCommand(
    'build:playground',
    {
      description: 'build payground',
      usage: 'vue-cli-service build:payground',
      details: 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack((config) => {
        const target = 'playground';
        const packagesDir = api.resolve('packages');
        const packageDir = `${packagesDir}/${target}`;

        process.env.TARGET = 'playground';

        options.pages = {
          index: `${packageDir}/src/main.ts`,
          mobile: {
            entry: `${packageDir}/src/device/index.ts`,
            template: 'public/index.html',
            title: 'Mobile',
            filename: 'mobile.html',
          },
        };

        config.externals({
          '@line-ui/line': {
            commonjs: '@line-ui/line',
            amd: '@line-ui/line',
            root: 'Line',
          },
        });
      });

      api.service.run('build', args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  'serve:playground': 'development',
  'build:playground': 'production',
};
