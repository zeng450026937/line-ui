module.exports = (api, options) => {
  api.registerCommand(
    'website',
    {
      description: 'serve website',
      usage: 'vue-cli-service website',
      details: 'TBD',
    },
    (args, rawArgs) => {
      const target = 'website';
      const packagesDir = api.resolve('packages');
      const packageDir = `${packagesDir}/${target}`;

      process.env.TARGET = target;
      process.env.LINE_DEV = false;

      api.chainWebpack((config) => {
        config.entry('app').clear().add(`${packageDir}/src/main.ts`);
      });

      api.service.run('serve', args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  website: 'development',
};
