module.exports = (api, options) => {
  api.registerCommand(
    'quickstart',
    {
      description : 'serve quickstart',
      usage       : 'vue-cli-service quickstart',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      const target = 'quick-start';
      const packageDir = api.resolve(`packages/${ target }`);

      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(`${ packageDir }/src/index.ts`);

        // auto import
        config.module.rule('vue')
          .use('skyline-auto-import')
          .loader(require.resolve('@skyline/webpack-loader-auto-import'))
          // check kebab case components
          .options('kebab')
          .after('vue-loader');
      });

      api.service.run('serve', args, rawArgs);
    },
  );
};

module.exports.defaultModes = {
  quickstart : 'development',
};
