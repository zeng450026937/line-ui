const path = require('path');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '../../');
const resolve = (p) => path.resolve(packageDir, p);

const pkgName = '@line-ui/themify-icons';
const pkg = require(`${nodemodulesDir}/${pkgName}/package.json`);
const prefix = 'ti';
const name = pkgName.replace('@line-ui/', '');

const distDir = resolve('src/components');
const dist = `${distDir}/${name}.tsx`;

const svgFolder = `${nodemodulesDir}/${pkgName}/SVG`;

const banner = `/* Themify Icons v${pkg.version} */\n`;

const files = () => glob.sync(`${svgFolder}/*.svg`);

const onName = (file) => {
  return `${prefix}-${path.basename(file, '.svg')}`.replace(/(-\w)/g, (m) =>
    m[1].toUpperCase()
  );
};

module.exports = {
  name,
  dist,
  files,
  banner,
  onName,
};
