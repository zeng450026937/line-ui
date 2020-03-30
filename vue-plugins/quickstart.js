const qs = require('querystring');

module.exports = (api, options) => {
  api.registerCommand(
    'quickstart',
    {
      description : 'serve quickstart',
      usage       : 'vue-cli-service quickstart',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      const target = 'quick-start';
      const packagesDir = api.resolve('packages');
      const packageDir = `${ packagesDir }/${ target }`;

      process.env.TARGET = target;
      process.env.SKYLINE_DEV = true;

      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(`${ packageDir }/src/index.ts`);
      });

      api.service.run('serve', args, rawArgs);
    },
  );
};

module.exports.defaultModes = {
  quickstart : 'development',
};
