const slugify = require('url-slug');
const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = 'material-design-icons';
const pkgDir = resolvePkg.sync(`${ pkgName }`);
const svgFolder = `${ pkgDir }`;

const onName = (file) => {
  file.basename = slugify(`${ file.basename.match(/ic_(.*)_24px/)[1] }`);
};

module.exports = task({
  pkg   : 'material-icons',
  files : [
    `${ svgFolder }/*/svg/production/ic_*_24px.svg`,
  ],
  onName,
});
