const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = '@line-ui/themify-icons';
const pkgDir = resolvePkg.sync(`${ pkgName }`);
const svgFolder = `${ pkgDir }/SVG`;

module.exports = task({
  pkg   : 'themify-icons',
  files : [
    `${ svgFolder }/*.svg`,
  ],
});
