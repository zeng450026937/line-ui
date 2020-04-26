module.exports = (api, options) => {
  api.registerCommand(
    'icons-explorer',
    {
      description: 'serve icons-explorer',
      usage: 'vue-cli-service icons-explorer',
      details: 'TBD',
    },
    (args, rawArgs) => {
      process.env.TARGET = 'icons-explorer';

      const { build } = args;
      const command = build ? 'build' : 'serve';
      api.service.run(command, args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  'icons-explorer': 'development',
};
