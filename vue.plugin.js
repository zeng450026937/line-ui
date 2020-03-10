const { log, warn } = require('@vue/cli-shared-utils');
const path = require('path');
const glob = require('globby');

const defaultModes = {};

const pluginDir = path.resolve(__dirname, 'vue-plugins');
const resolve = p => path.resolve(pluginDir, p);

const plugins = glob.sync('**/*.js', { cwd: pluginDir })
  .sort()
  .map(p => {
    const plugin = require(resolve(p));
    plugin.file = p;
    Object.assign(defaultModes, plugin.defaultModes);
    return plugin;
  });

module.exports = (api, options) => {
  plugins.forEach(p => {
    try {
      p(api, options);
    } catch (error) {
      warn(
        `Loading plugin: ${ p.file } failed`,
      );
    }
  });
  log();
};

module.exports.defaultModes = defaultModes;
