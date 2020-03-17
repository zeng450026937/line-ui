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

        // for development, set 'skyline' alias to source code
        config.resolve.alias
          .set('skyline', api.resolve('packages/skyline'));
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

        // for production, 'skyline' is external
        config.externals({
          skyline : {
            commonjs : 'skyline',
            amd      : 'skyline',
            root     : 'Skyline',
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
