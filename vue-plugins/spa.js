module.exports = (api, options) => {
  api.registerCommand('spa', async (args, rawArgs) => {
    api.chainWebpack((config) => {
      config.entry('app').clear().add(api.resolve('src/app.ts'));
    });
    const { build } = args;
    const command = build ? 'build' : 'serve';
    await api.service.run(command, args, rawArgs);
  });
};

module.exports.defaultModes = {
  spa: 'development',
};
