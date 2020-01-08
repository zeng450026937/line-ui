module.exports = (api, options) => {
  api.registerCommand(
    'build:skyline',
    {
      description : 'build skyline(library)',
      usage       : 'vue-cli-service build:skyline',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      args.name = 'Skyline';
      args.filename = 'skyline';
      args.target = 'lib';
      args.entry = './src/index.ts';
      args.dest = './dist/library';

      api.service.run('build', args);
    },
  );

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
  'build:skyline' : 'production',
  'build:website' : 'production',
};
