const path = require('path');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '../../');
const resolve = (p) => path.resolve(packageDir, p);

const pkgName = 'ionicons';
const pkg = require(`${nodemodulesDir}/${pkgName}/package.json`);
const prefix = 'ion';
const name = 'ionic-icons';

const distDir = resolve('src/components');
const dist = `${distDir}/${name}.tsx`;

const svgFolder = `${nodemodulesDir}/${pkgName}/dist/ionicons/svg`;

const banner = `/* Ionic Icons v${pkg.version} */\n`;

const files = () => glob.sync(`${svgFolder}/*.svg`);

const onName = (file) => {
  return `${prefix}-${path.basename(file, '.svg')}`.replace(/(-\w)/g, (m) =>
    m[1].toUpperCase()
  );
};

const onData = (data) => {
  return data
    .replace(
      / ?class="(?:ionicon|ionicon-stroke-width|ionicon-fill-none)"/g,
      ''
    )
    .replace(/ ?class="ionicon-fill-none[^"]*"/g, ' style="fill: none"');
};

module.exports = {
  name,
  dist,
  files,
  banner,
  onName,
  onData,
};
