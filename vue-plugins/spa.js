module.exports = (api, options) => {
  api.registerCommand('spa', (args, rawArgs) => {
    const { build } = args;
    const command = build ? 'build' : 'serve';
    api.service.run(command, args, rawArgs);
  });
};

module.exports.defaultModes = {
  spa: 'development',
};
