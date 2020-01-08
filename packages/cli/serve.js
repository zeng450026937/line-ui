module.exports = (api, options) => {
  api.registerCommand(
    'serve:website',
    {
      description : 'serve skyline website(homepage)',
      usage       : 'vue-cli-service serve:website',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      options.pages = {
        mobile : {
          entry    : 'packages/website/mobile/main.ts',
          template : 'public/index.html',
          title    : 'Mobile',
          filename : 'mobile.html',
        },
        website : {
          entry    : 'packages/website/desktop/main.ts',
          template : 'public/index.html',
          title    : 'WebSite',
          filename : 'website.html',
        },
      };
      api.chainWebpack(config => {
        config.entry('app').clear();
      });
      api.service.run('serve', args);
    },
  );
};

module.exports.defaultModes = {
  'serve:website' : 'development',
};
