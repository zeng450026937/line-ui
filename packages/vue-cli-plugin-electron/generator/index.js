const fs = require('fs');

module.exports = (api, opts, rootOpts) => {
  api.render('./template');

  api.extendPackage({
    scripts: {
      'pack:electron': 'vue-cli-service pack:electron --modern',
      'serve:electron': 'vue-cli-service serve:electron --modern',
      'build:electron': 'vue-cli-service build:electron --modern',
    },
    devDependencies: {
      crocket: '^0.9.11',
      electron: '^8.2.3',
    },
  });

  api.injectImports(api.entryFile, "import './plugins/electron'");

  api.onCreateComplete(() => {
    const gitignorePath = api.resolve('.gitignore');
    let content;

    if (fs.existsSync(gitignorePath)) {
      content = fs.readFileSync(gitignorePath, { encoding: 'utf8' });
    } else {
      content = '';
    }

    if (content.indexOf('/out/') === -1) {
      content += '\n/out/\n';

      fs.writeFileSync(gitignorePath, content, { encoding: 'utf8' });
    }
  });
};
