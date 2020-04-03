const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = 'ionicons';
const pkgDir = resolvePkg.sync(`${pkgName}`);
const svgFolder = `${pkgDir}/dist/ionicons/svg`;

const onData = (data) => {
  return data
    .toString()
    .replace(/ +class="ionicon-fill-none"/g, ' fill="none"')
    .replace(/ +class="ionicon-stroke-width"/g, ' stroke-width="32"')
    .replace(
      / +class="ionicon-fill-none ionicon-stroke-width"/g,
      ' fill="none" stroke-width="32"'
    )
    .replace(/ +class="ionicon"/g, ' stroke="currentColor"');
};

module.exports = task({
  pkg: 'ionic-icons',
  files: [`${svgFolder}/*.svg`],
  onData,
});
