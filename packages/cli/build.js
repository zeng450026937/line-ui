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
      args.entry = './src/main.ts';
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
      args.dest = './dist/website';
      api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'build:skyline' : 'production',
  'build:website' : 'production',
};
