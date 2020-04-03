const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const packageDir = path.resolve(__dirname, '..');
const resolve = (p) => path.resolve(packageDir, p);
const relative = (from, to) => path.relative(from, to).split('\\').join('/');

const render = require('./render');
const logger = require('./logger');
const warning = require('./warning');

const distDir = resolve('src');
const dist = `${distDir}/index.ts`;

const configs = [
  require('./configs/eva-icons'),
  require('./configs/fontawesome-icons'),
  require('./configs/ionic-icons'),
  require('./configs/material-icons'),
  require('./configs/md-icons'),
  require('./configs/themify-icons'),
];

run();

async function run() {
  const now = Date.now();

  for (const config of configs) {
    await render(config);
  }

  logger.log();
  logger.log('index.ts', 'GEN');

  const files = glob.sync(`${resolve('src')}/**/*.tsx`);
  const exports = files.map((file) => {
    const dir = relative(path.dirname(dist), path.dirname(file));
    const name = path.basename(file, '.tsx');
    const from = `${'.'}/${dir}/${name}`;
    return `export * from '${from}';`;
  });

  exports.unshift(warning);
  exports.push('');

  await fs.writeFile(dist, exports.join('\n'), 'utf-8');

  logger.log(`in ${(Date.now() - now) / 1000}s`, 'DONE');
}
