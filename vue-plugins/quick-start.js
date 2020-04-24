module.exports = (api, options) => {
  api.registerCommand(
    'quick-start',
    {
      description: 'serve quick-start',
      usage: 'vue-cli-service quick-start',
      details: 'TBD',
    },
    (args, rawArgs) => {
      process.env.TARGET = 'quick-start';

      const { build } = args;
      const command = build ? 'build' : 'serve';
      api.service.run(command, args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  'quick-start': 'development',
};
