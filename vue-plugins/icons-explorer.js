module.exports = (api, options) => {
  api.registerCommand(
    'icons-explorer',
    {
      description: 'serve icons-explorer',
      usage: 'vue-cli-service icons-explorer',
      details: 'TBD',
    },
    (args, rawArgs) => {
      const target = 'icons-explorer';
      const packagesDir = api.resolve('packages');
      const packageDir = `${packagesDir}/${target}`;

      process.env.TARGET = target;

      api.chainWebpack((config) => {
        config.entry('app').clear().add(`${packageDir}/src/main.ts`);
      });

      const { build } = args;
      const command = build ? 'build' : 'serve';
      api.service.run(command, args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  quickstart: 'development',
};
