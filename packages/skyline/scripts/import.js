const fs = require('fs-extra');
const path = require('path');
const skyline = require('skyline').default;

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);

const distDir = resolve('dist');

const logger = require('./logger');

run();

async function run() {
  logger.log();
  logger.log('import.config.json', 'GEN');

  const config = {
    // package name
    name       : 'skyline',
    // component prefix
    prefix     : 'line',
    // check tag
    tag        : true,
    // check directive
    dir        : true,
    // supported components
    components : Object.keys(skyline.components),
    // supported directives
    directives : Object.keys(skyline.directives).filter(key => /^v/i.test(key)),
  };

  await fs.writeJSON(
    `${ distDir }/import.config.json`,
    config,
    { spaces: 2 },
  );
}

module.exports = {
  name   : 'skyline',
  prefix : 'line',

  kebab  : true,
  pascal : true,

  components : Object.keys(skyline.components),
  directives : Object.keys(skyline.directives),

  // transform from tag to component/directive name
  transform : (tag, cases) => {
    // kebab case
    // line-app

    // pascal case
    // LineApp
    const importName = '';
    return importName;
  },
};
