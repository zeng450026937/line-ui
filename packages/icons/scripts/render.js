const path = require('path');
const fs = require('fs-extra');

const packageDir = path.resolve(__dirname, '..');
const resolve = p => path.resolve(packageDir, p);

const optimize = require('./optimize');
const logger = require('./logger');
const warning = require('./warning');

module.exports = async (options) => {
  const {
    name,
    files = () => [],
    dist = `${ resolve('src/components') }/${ name }.tsx`,
    banner = '',
    onName = (file) => path.basename(file, '.svg'),
    onData = (data) => data,
  } = options;

  logger.log();
  logger.log(`- ${ name } -`, 'GEN');

  await fs.remove(dist);

  const svgExports = [];
  const svgFiles = await files();
  const iconNames = new Set();
  const skipped = [];

  svgExports.push(banner);
  svgExports.push(warning);
  svgExports.push('/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */');
  svgExports.push('import { CreateElement } from \'vue\';\n');

  for (const file of svgFiles) {
    logger.clear(` OPTIMIZE  ${ path.basename(file) }`);

    const name = onName(file);

    if (iconNames.has(name)) {
      logger.clear(` WARN duplication detected, ${ name }`);
      skipped.push(name);
      continue;
    }

    const content = await optimize(file);
    const data = onData(content.data);
    const svgExport = `export const ${ name } = (h: CreateElement) => (${ data });`;

    svgExports.push(svgExport);
    iconNames.add(name);

    logger.clear();
  }

  if (svgExports.length === 0) {
    logger.log(`${ name } skipped completely`, 'WARN');
  }

  svgExports.push('');

  await fs.ensureDir(path.dirname(dist));

  await fs.writeFile(
    dist,
    svgExports.join('\n'),
    'utf-8',
  );

  logger.log(`${ iconNames.size } icons`, 'DONE');

  if (skipped.length > 0) {
    logger.log(` SKIPPED(${ skipped.length }): ${ skipped }`);
  }
};
