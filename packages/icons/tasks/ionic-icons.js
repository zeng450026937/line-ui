const task = require('./utils/task');
const resolvePkg = require('./utils/resolvePkg');

const pkgName = 'ionicons';
const pkgDir = resolvePkg.sync(`${ pkgName }`);
const svgFolder = `${ pkgDir }/dist/ionicons/svg`;

const onData = (data) => {
  return data.toString()
    .replace(/ ?class="(?:ionicon|ionicon-stroke-width|ionicon-fill-none)"/g, '')
    .replace(/ ?class="ionicon-fill-none[^"]*"/g, ' style="fill: none"');
};

module.exports = task({
  pkg   : 'ionic-icons',
  files : [
    `${ svgFolder }/*.svg`,
  ],
  onData,
});
