module.exports = (api, options) => {
  api.registerCommand('spa', async (args, rawArgs) => {
    const { build } = args;
    const command = build ? 'build' : 'serve';
    await api.service.run(command, args, rawArgs);
  });
};

module.exports.defaultModes = {
  spa: 'development',
};
