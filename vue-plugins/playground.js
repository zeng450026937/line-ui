module.exports = (api, options) => {
  api.registerCommand(
    'serve:playground',
    {
      description: 'serve payground',
      usage: 'vue-cli-service serve:playground',
      details: 'TBD',
    },
    (args, rawArgs) => {
      options.pages = {
        index: './packages/playground/app.ts',
        mobile: {
          entry: './packages/playground/src/device/index.ts',
          template: 'public/index.html',
          title: 'Mobile',
          filename: 'mobile.html',
        },
      };
      api.chainWebpack((config) => {
        // config.entry('app')
        //   .clear()
        //   .add(api.resolve('packages/playground/app.ts'));

        // for development, set 'line' alias to source code
        config.resolve.alias.set('line', api.resolve('packages/line'));
      });

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
        config
          .entry('app')
          .clear()
          .add(api.resolve('packages/playground/app.ts'));

        // for production, 'line' is external
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
