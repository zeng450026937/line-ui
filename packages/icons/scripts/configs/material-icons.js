const path = require('path');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '../../');
const resolve = p => path.resolve(packageDir, p);

const pkgName = 'material-design-icons';
const pkg = require(`${ nodemodulesDir }/${ pkgName }/package.json`);
const prefix = 'md';
const name = pkgName.replace('-design', '');

const distDir = resolve('src/components');
const dist = `${ distDir }/${ name }.tsx`;

const svgFolder = `${ nodemodulesDir }/${ pkgName }`;

const banner = `/* Google Material Design Icons v${ pkg.version } */\n`;

const files = () => glob.sync(`${ svgFolder }/*/svg/production/ic_*_24px.svg`);

const onName = (file) => {
  return (`${ prefix }_${ file.match(/ic_(.*)_24px\.svg/)[1] }`)
    .replace(/(_\w)/g, m => m[1].toUpperCase());
};

module.exports = {
  name,
  dist,
  files,
  banner,
  onName,
};
