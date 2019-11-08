module.exports = (api, options) => {
  api.registerCommand(
    'serve:website',
    {
      description : 'build skyline website(homepage)',
      usage       : 'vue-cli-service serve:website',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('./packages/website/desktop/main.ts'));
      });
      api.service.run('serve', args);
    },
  );
};

module.exports.defaultModes = {
  'build:skyline' : 'production',
  'serve:website' : 'development',
};
