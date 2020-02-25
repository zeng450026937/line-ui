const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

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
};

module.exports.defaultModes = {
  'build:skyline' : 'production',
};
