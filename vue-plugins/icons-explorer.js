const qs = require('querystring');

module.exports = (api, options) => {
  api.registerCommand(
    'icons-explorer',
    {
      description : 'serve icons-explorer',
      usage       : 'vue-cli-service icons-explorer',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      const target = 'icons-explorer';
      const packagesDir = api.resolve('packages');
      const packageDir = `${ packagesDir }/${ target }`;

      process.env.TARGET = target;
      process.env.SKYLINE_DEV = true;

      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(`${ packageDir }/src/app.ts`);
      });

      api.service.run('serve', args, rawArgs);
    },
  );
};

module.exports.defaultModes = {
  quickstart : 'development',
};
