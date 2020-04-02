const execa = require('execa');

const booleanify = (value) => value && value !== 'false';

module.exports = (api, options) => {
  api.registerCommand(
    'build:line-ui',
    {
      description : 'build line-ui(library)',
      usage       : 'vue-cli-service build:line-ui [options] [target]',
      options     : {
        '--gen'        : 'force regenerate file',
        '--style'      : 'build style sheet',
        '--javascript' : 'build javascript',
        '--formats'    : 'specify build formats (default: cjs, ems)',
      },
    },
    async (args, rawArgs) => {
      // const target = args._[0];
      const {
        gen = false,
        style = true,
        javascript = true,
      } = args;

      // Phase 1
      // generate files
      if (booleanify(gen)) {
        await execa.node(
          api.resolve('scripts/line-ui/components'),
          { stdio: 'inherit' },
        );
        await execa.node(
          api.resolve('scripts/line-ui/directives'),
          { stdio: 'inherit' },
        );
        await execa.node(
          api.resolve('scripts/line-ui/mixins'),
          { stdio: 'inherit' },
        );
        await execa.node(
          api.resolve('scripts/line-ui/style'),
          { stdio: 'inherit' },
        );
      }

      // Phase 2
      // build javascript
      if (booleanify(javascript)) {
        await execa.node(
          api.resolve('scripts/line-ui/build.javascript'),
          { stdio: 'inherit' },
        );
      }

      // Phase 3
      // build style sheet
      if (booleanify(style)) {
        await execa.node(
          api.resolve('scripts/line-ui/build.style'),
          { stdio: 'inherit' },
        );
      }
    },
  );
};

module.exports.defaultModes = {
  'build:line-ui' : 'production',
};
