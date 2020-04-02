module.exports = (api, options) => {
  api.registerCommand(
    'serve:playground',
    {
      description : 'serve line-ui playground',
      usage       : 'vue-cli-service serve:playground',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        // redirect to playground
        config.entry('app')
          .clear()
          .add(api.resolve('./packages/playground/main.ts'));
      });
      api.service.run('serve', args);
    },
  );

  api.registerCommand(
    'serve:website',
    {
      description : 'serve line-ui website(homepage)',
      usage       : 'vue-cli-service serve:website',
      details     : 'TBD',
    },
    (args, rawArgs) => {
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
      api.service.run('serve', args);
    },
  );
};

module.exports.defaultModes = {
  'serve:playground' : 'development',
  'serve:website'    : 'development',
};
