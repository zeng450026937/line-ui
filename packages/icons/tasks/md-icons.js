const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = '@mdi/svg';
const pkgDir = resolvePkg.sync(`${pkgName}`);
const svgFolder = `${pkgDir}/svg`;

module.exports = task({
  pkg: 'md-icons',
  files: [`${svgFolder}/**/*.svg`],
});
