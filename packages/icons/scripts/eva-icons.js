const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '..');
const resolve = p => path.resolve(packageDir, p);

const packageName = 'eva-icons';

const distDir = resolve(`gen/${ packageName }`);
const dist = resolve(`${ distDir }/index.ts`);

const svgFolder = `${ nodemodulesDir }/${ packageName }`;
const iconTypes = ['fill', 'outline'];
const iconNames = new Set();

const skipped = [];

run();

async function run() {
  const svgExports = [];

  for (const type of iconTypes) {
    const svgFiles = glob.sync(`${ svgFolder }/${ type }/svg/*.svg`);

    for (const file of svgFiles) {
      svgExports.push(
        await extract(file),
      );
    }
  }

  await fs.ensureDir(distDir);

  // svg data
  if (svgExports.length === 0) {
    console.log('WARNING. Eva-icons skipped completely');
  } else {
    // eol-last
    svgExports.push('');

    await fs.writeFile(
      dist,
      getBanner() + svgExports.filter(x => x !== null).join('\n'),
      'utf-8',
    );

    if (skipped.length > 0) {
      console.log(`eva-icons - skipped (${ skipped.length }): ${ skipped }`);
    }
  }

  // icon font
  const webfont = [
    'Eva-Icons',
  ];
  const fontTypes = [
    'svg', 'eot', 'ttf', 'woff', 'woff2',
  ];

  for (const file of webfont) {
    for (const type of fontTypes) {
      await fs.copy(
        `${ nodemodulesDir }/${ packageName }/style/fonts/${ file }.${ type }`,
        `${ distDir }/${ file }.${ type }`,
      );
    }
  }
}

async function extract(file) {
  const name = (`eva-${ path.basename(file, '.svg') }`)
    .replace(/(-\w)/g, m => m[1].toUpperCase());

  if (iconNames.has(name)) {
    return null;
  }

  const content = await fs.readFile(file, 'utf-8');

  try {
    const dPath = content.match(/ d="([\w ,.-]+)"/)[1];
    const viewBox = content.match(/viewBox="([0-9 .]+)"/)[1];
    const hasViewBox = viewBox !== '0 0 24 24' && viewBox !== '0 0 24.1 24.1' && viewBox !== '0 0 24.2 24.2';

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
  return `/* Fontawesome Free v${ version } */\n\n`;
}
