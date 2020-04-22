const ConfigParser = require('./lib/config-parser');
const ConfigProvide = require('./lib/config-provide');

const NS = 'config-plugin';

class ConfigPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const { options } = this;
    const { dedupe = false, optimize = false } = options;

    const provide = new ConfigProvide(options);
    const parser = new ConfigParser(options);

    parser.apply(compiler);
    provide.apply(compiler);

    compiler.hooks.compilation.tap(NS, (compilation) => {
      const hooks = ConfigParser.getHooks(compilation);

      // parser hooks
      if (optimize) {
        hooks.optimize.tap(NS, (manifests) => {
          let count = 0;
          manifests.forEach((manifest) => {
            manifest.configs.forEach((config) => {
              config.replaceTo = `${count++}`;
            });
          });
        });
      }

      hooks.afterOptimize.tap(NS, (manifests) => {
        const configs = {};
        for (const manifest of manifests) {
          manifest.configs.forEach((config) => {
            configs[config.replaceTo] = config.fallback;
          });
        }
        provide.replace(configs);
      });
    });
  }
}

module.exports = ConfigPlugin;
