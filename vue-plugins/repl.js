module.exports = (api, options) => {
  api.registerCommand(
    'repl',
    {
      description: 'serve repl',
      usage: 'vue-cli-service repl',
      details: 'TBD',
    },
    (args, rawArgs) => {
      process.env.TARGET = 'repl';
      process.env.LINE_DEV = true;

      const { build } = args;
      const command = build ? 'build' : 'serve';
      api.service.run(command, args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  repl: 'development',
};
