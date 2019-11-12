module.exports = (api, options) => {
  api.registerCommand(
    'build:website',
    {
      description : 'build skyline website(homepage)',
      usage       : 'vue-cli-service build:website',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('./packages/website/desktop/main.ts'));
      });
      api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'build:website' : 'production',
};
