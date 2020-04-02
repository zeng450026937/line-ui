const execa = require('execa');

module.exports = (api, options) => {
  api.registerCommand(
    'lint:style',
    {
      description : 'lint line style',
      usage       : 'vue-cli-service lint:style',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      execa('stylelint', ['src/**/*.scss', ...rawArgs], { stdio: 'inherit' });
    },
  );
};

module.exports.defaultModes = {
  'lint:style' : 'production',
};
