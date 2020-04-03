const path = require('path');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '../../');
const resolve = (p) => path.resolve(packageDir, p);

const pkgName = '@mdi/svg';
const pkg = require(`${nodemodulesDir}/${pkgName}/package.json`);
const prefix = 'mdi';
const name = 'md-icons';

const distDir = resolve('src/components');
const dist = `${distDir}/${name}.tsx`;

const svgFolder = `${nodemodulesDir}/${pkgName}/svg`;

const banner = `/* Material Design Icons v${pkg.version} */\n`;

const files = () => glob.sync(`${svgFolder}/**/*.svg`);

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
