const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = 'eva-icons';
const pkgDir = resolvePkg.sync(`${pkgName}`);
const svgFolder = `${pkgDir}`;

module.exports = task({
  pkg: 'eva-icons',
  files: [`${svgFolder}/fill/svg/*.svg`, `${svgFolder}/outline/svg/*.svg`],
});
