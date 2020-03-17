const path = require('path');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '../../');
const resolve = p => path.resolve(packageDir, p);

const pkgName = 'eva-icons';
const pkg = require(`${ nodemodulesDir }/${ pkgName }/package.json`);
const prefix = 'eva';
const name = pkgName;

const distDir = resolve('src/components');
const dist = `${ distDir }/${ name }.tsx`;

const svgFolder = `${ nodemodulesDir }/${ pkgName }`;

const banner = `/* Eva Icons v${ pkg.version } */\n`;

const files = () => [
  ...glob.sync(`${ svgFolder }/fill/svg/*.svg`),
  ...glob.sync(`${ svgFolder }/outline/svg/*.svg`),
];

const onName = (file) => {
  return (`${ prefix }-${ path.basename(file, '.svg') }`)
    .replace(/(-\w)/g, m => m[1].toUpperCase());
};

module.exports = {
  name,
  dist,
  files,
  banner,
  onName,
};
