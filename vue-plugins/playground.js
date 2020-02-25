
module.exports = (api, options) => {
  api.registerCommand(
    'serve:playground',
    {
      description : 'serve payground',
      usage       : 'vue-cli-service serve:playground',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('packages/playground/app.ts'));

        // for development, set "skyline" alias to source code
        config.resolve.alias
          .set('skyline', api.resolve('src'));
      });
      api.service.run('serve', args);
    },
  );

  api.registerCommand(
    'build:playground',
    {
      description : 'build payground',
      usage       : 'vue-cli-service build:payground',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('packages/playground/app.ts'));

        // for production, externalize "skyline"
        config.externals({
          skyline : {
            commonjs : 'skyline',
            amd      : 'skyline',
            root     : 'Skyline',
          },
        });
      });
      api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'serve:playground' : 'development',
  'build:playground' : 'production',
};
