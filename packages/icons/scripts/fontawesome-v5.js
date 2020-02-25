const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const cwd = process.cwd();
const nodemodulesDir = path.resolve(cwd, 'node_modules');
const packageDir = path.resolve(__dirname, '..');
const resolve = p => path.resolve(packageDir, p);

const packageName = '@fortawesome/fontawesome-free';

const distDir = resolve(`gen/${ packageName.replace('@fortawesome/', '') }-v5`);
const dist = resolve(`${ distDir }/index.ts`);

const svgFolder = `${ nodemodulesDir }/${ packageName }/svgs`;
const iconTypes = ['brands', 'regular', 'solid'];
const iconNames = new Set();

const skipped = [];

run();

async function run() {
  const svgExports = [];

  for (const type of iconTypes) {
    const svgFiles = glob.sync(`${ svgFolder }/${ type }/*.svg`);

    for (const file of svgFiles) {
      svgExports.push(
        await extract(file, `fa${ type.charAt(0) }-`),
      );
    }
  }

  await fs.ensureDir(distDir);

  // svg data
  if (svgExports.length === 0) {
    console.log('WARNING. Fontawesome skipped completely');
  } else {
    // eol-last
    svgExports.push('');

    await fs.writeFile(
      dist,
      getBanner() + svgExports.filter(x => x !== null).join('\n'),
      'utf-8',
    );

    if (skipped.length > 0) {
      console.log(`Fontawesome - skipped (${ skipped.length }): ${ skipped }`);
    }
  }

  // icon font
  const webfont = [
    'fa-brands-400',
    'fa-regular-400',
    'fa-solid-900',
  ];
  const fontTypes = [
    'svg', 'eot', 'ttf', 'woff', 'woff2',
  ];

  for (const file of webfont) {
    for (const type of fontTypes) {
      await fs.copy(
        `${ nodemodulesDir }/${ packageName }/webfonts/${ file }.${ type }`,
        `${ distDir }/${ file }.${ type }`,
      );
    }
  }
}

async function extract(file, prefix) {
  const name = (prefix + path.basename(file, '.svg'))
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
  return `/* Fontawesome Free v${ version } */\n\n`;
}
