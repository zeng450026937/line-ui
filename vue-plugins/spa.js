module.exports = (api, options) => {
  api.registerCommand(
    'spa',
    async (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('src/app.ts'));
      });

      await api.service.run('serve', args, rawArgs);
    },
  );
};
