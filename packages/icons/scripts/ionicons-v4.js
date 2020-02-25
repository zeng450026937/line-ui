const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '..');
const resolve = p => path.resolve(packageDir, p);

const packageName = 'ionicons';

const distDir = resolve(`gen/${ packageName }-v4`);
const dist = resolve(`${ distDir }/index.ts`);

const svgFolder = `${ nodemodulesDir }/${ packageName }/dist/ionicons/svg`;
const iconNames = new Set();

const skipped = [];

run();

async function run() {
  const svgExports = [];
  const svgFiles = glob.sync(`${ svgFolder }/*.svg`);

  for (const file of svgFiles) {
    svgExports.push(
      await extract(file),
    );
  }

  await fs.ensureDir(distDir);

  // svg data
  if (svgExports.length === 0) {
    console.log('WARNING. Ionicons skipped completely');
  } else {
    // eol-last
    svgExports.push('');

    await fs.writeFile(
      dist,
      getBanner() + svgExports.filter(x => x !== null).join('\n'),
      'utf-8',
    );

    if (skipped.length > 0) {
      console.log(`Ionicons - skipped (${ skipped.length }): ${ skipped }`);
    }
  }

  // icon font
  const webfont = [
    'ionicons',
  ];
  const fontTypes = [
    'svg', 'eot', 'ttf', 'woff', 'woff2',
  ];

  for (const file of webfont) {
    for (const type of fontTypes) {
      await fs.copy(
        `${ nodemodulesDir }/${ packageName }/dist/fonts/${ file }.${ type }`,
        `${ distDir }/${ file }.${ type }`,
      );
    }
  }
}

async function extract(file) {
  const name = (`ion-${ path.basename(file, '.svg') }`)
    .replace(/(-\w)/g, m => m[1].toUpperCase());

  if (iconNames.has(name)) {
    return null;
  }

  const content = await fs.readFile(file, 'utf-8');

  try {
    const dPath = content.match(/ d="([\w ,.-]+)"/)[1];
    const viewBox = content.match(/viewBox="([0-9 .]+)"/)[1];
    const hasViewBox = viewBox !== '0 0 24 24';

    if (hasViewBox) {
      console.log('WARNING. viewBox:', name, viewBox);
    }

    iconNames.add(name);
    return `export const ${ name } = '${ dPath }${ hasViewBox ? `|${ viewBox }` : '' }';`;
  } catch (err) {
    skipped.push(name);
    return null;
  }
}

function getBanner() {
  const { version } = require(`${ nodemodulesDir }/${ packageName }/package.json`);
  return `/* Ionicons v${ version } */\n\n`;
}
