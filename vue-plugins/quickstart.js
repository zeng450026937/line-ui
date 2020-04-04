const qs = require('querystring');

module.exports = (api, options) => {
  api.registerCommand(
    'quick-start',
    {
      description: 'serve quick-start',
      usage: 'vue-cli-service quick-start',
      details: 'TBD',
    },
    (args, rawArgs) => {
      const target = 'quick-start';
      const packagesDir = api.resolve('packages');
      const packageDir = `${packagesDir}/${target}`;

      process.env.TARGET = target;
      process.env.LINE_DEV = true;

      api.chainWebpack((config) => {
        config.entry('app').clear().add(`${packageDir}/src/index.ts`);
      });

      api.service.run('serve', args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  'quick-start': 'development',
};
