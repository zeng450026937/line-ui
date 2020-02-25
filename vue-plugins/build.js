const execa = require('execa');

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
      args.entry = './packages/skyline/src/index.ts';
      args.dest = './dist/skyline';

      api.service.run('build', args);
    },
  );

  api.registerCommand(
    'rollup',
    {
      description : 'build packages',
      usage       : 'vue-cli-service rollup',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      await execa(
        `node ${ api.resolve('scripts/rollup.js') }`,
        rawArgs,
        { stdio: 'inherit' },
      );
    },
  );

  api.registerCommand(
    'build:scss',
    {
      description : 'build packages',
      usage       : 'vue-cli-service rollup',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      await execa(
        `node ${ api.resolve('scripts/build-css.js') }`,
        rawArgs,
        { stdio: 'inherit' },
      );
    },
  );
};

module.exports.defaultModes = {
  'build:skyline' : 'production',
  rollup          : 'production',
  'build:scss'    : 'production',
};
