module.exports = (api, options) => {
  api.registerCommand(
    'serve:website',
    {
      description : 'serve payground',
      usage       : 'vue-cli-service serve:website',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('packages/website/app.ts'));

        // for development, set 'line-ui' alias to source code
        config.resolve.alias
          .set('line-ui', api.resolve('packages/line-ui'));
      });

      api.service.run('serve', args, rawArgs);
    },
  );

  api.registerCommand(
    'build:website',
    {
      description : 'build payground',
      usage       : 'vue-cli-service build:payground',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('packages/website/app.ts'));

        // for production, 'line-ui' is external
        config.externals({
          '@line-ui/line' : {
            commonjs : '@line-ui/line',
            amd      : '@line-ui/line',
            root     : 'Line',
          },
        });
      });

      api.service.run('build', args, rawArgs);
    },
  );
};

module.exports.defaultModes = {
  'serve:website' : 'development',
  'build:website' : 'production',
};
