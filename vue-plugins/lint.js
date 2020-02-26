const execa = require('execa');

module.exports = (api, options) => {
  api.registerCommand(
    'lint:style',
    {
      description : 'lint skyline style',
      usage       : 'vue-cli-service lint:style',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      await execa('stylelint', ['src/**/*.scss', ...rawArgs], { stdio: 'inherit' });
    },
  );
};

module.exports.defaultModes = {
  'lint:style' : 'production',
};
