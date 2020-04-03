const path = require('path');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '../../');
const resolve = (p) => path.resolve(packageDir, p);

const pkgName = '@fortawesome/fontawesome-free';
const pkg = require(`${nodemodulesDir}/${pkgName}/package.json`);
const prefix = 'fa';
const name = 'fontawesome-icons';

const distDir = resolve('src/components');
const dist = `${distDir}/${name}.tsx`;

const svgFolder = `${nodemodulesDir}/${pkgName}/svgs`;
const iconTypes = ['brands', 'regular', 'solid'];

const banner = `/* Fontawesome Icons v${pkg.version} */\n`;

const files = () =>
  iconTypes.reduce((pre, type) => {
    return pre.concat(glob.sync(`${svgFolder}/${type}/*.svg`));
  }, []);

const onName = (file) => {
  const dir = path.dirname(file);
  const type = path.basename(dir);
  return `${prefix + type.charAt(0)}-${path.basename(
    file,
    '.svg'
  )}`.replace(/(-\w)/g, (m) => m[1].toUpperCase());
};

module.exports = {
  name,
  dist,
  files,
  banner,
  onName,
};
