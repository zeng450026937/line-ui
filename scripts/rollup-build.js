const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

const args = require('minimist')(process.argv.slice(2));

const targets = args._;
const formats = args.formats || args.f;
const devOnly = args.devOnly || args.d;
const prodOnly = !devOnly && (args.prodOnly || args.p);
const sourceMap = args.sourcemap || args.s;
const isRelease = args.release;
const buildTypes = args.t || args.types || isRelease;
const buildAllMatching = args.all || args.a;
const lean = args.lean || args.l;
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7);

run();

async function run() {
  await build();
}

async function build(target) {
  const pkgDir = path.resolve(__dirname, '..');
  const pkg = require(`${ pkgDir }/package.json`);

  // only build published packages for release
  if (isRelease && pkg.private) {
    return;
  }

  // if building a specific format, do not remove dist.
  if (!formats) {
    await fs.remove(`${ pkgDir }/dist`);
  }

  const env = (pkg.buildOptions && pkg.buildOptions.env)
    || (devOnly ? 'development' : 'production');
  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `COMMIT:${ commit }`,
        `NODE_ENV:${ env }`,
        formats ? `FORMATS:${ formats }` : '',
        buildTypes ? 'TYPES:true' : '',
        prodOnly ? 'PROD_ONLY:true' : '',
        lean ? 'LEAN:true' : '',
        sourceMap ? 'SOURCE_MAP:true' : '',
      ]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit' },
  );
}
