const path = require('path');
const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = '@fortawesome/fontawesome-free';
const pkgDir = resolvePkg.sync(`${pkgName}`);
const svgFolder = `${pkgDir}/svgs`;
const iconTypes = ['brands', 'regular', 'solid'];

const onName = (file) => {
  const dir = file.dirname;
  const type = path.basename(dir);
  file.basename = `${type.charAt(0)}-${file.basename}`;
};

module.exports = task({
  pkg: 'fa-icons',
  files: iconTypes.map((type) => `${svgFolder}/${type}/*.svg`),
  onName,
});
