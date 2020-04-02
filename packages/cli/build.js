module.exports = (api, options) => {
  api.registerCommand(
    'build:line-ui',
    {
      description : 'build line-ui(library)',
      usage       : 'vue-cli-service build:line-ui',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      args.name = 'Skyline';
      args.filename = 'line-ui';
      args.target = 'lib';
      args.entry = './src/main.ts';
      args.dest = './dist/library';

      api.service.run('build', args);
    },
  );

  api.registerCommand(
    'build:website',
    {
      description : 'build line-ui website(homepage)',
      usage       : 'vue-cli-service build:website',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      options.publicPath = '/line-ui/';
      // options.pages = {
      //   mobile : {
      //     entry    : 'packages/website/mobile/main.ts',
      //     template : 'public/index.html',
      //     title    : 'Mobile',
      //     filename : 'mobile.html',
      //   },
      //   website : {
      //     entry    : 'packages/website/desktop/main.ts',
      //     template : 'public/index.html',
      //     title    : 'WebSite',
      //     filename : 'website.html',
      //   },
      // };
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('./packages/website/main.ts'));
      });
      args.dest = './dist/website';
      api.service.run('build', args).catch(() => {});
    },
  );
};

module.exports.defaultModes = {
  'build:line-ui' : 'production',
  'build:website' : 'production',
};
