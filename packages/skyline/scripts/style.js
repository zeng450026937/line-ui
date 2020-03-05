const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const chalk = require('chalk');
const { gzipSync } = require('zlib');
const { compress } = require('brotli');

const sass = require('sass');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);

const srcDir = resolve('src/components');
const distDir = resolve('style');

const styleDir = resolve('src/components');
const bundleDir = resolve('src/themes');

const autoprefix = postcss([autoprefixer()]);
const nano = postcss([
  cssnano({
    preset : ['default', {
      mergeLonghand        : false,
      convertValues        : false,
      cssDeclarationSorter : false,
      reduceTransforms     : false,
    }],
  }),
]);

const warning = require('./warning');
const logger = require('./logger');

run();

async function run() {
  // generate bundles
  const defaultBundle = 'skyline.bundle.scss';

  const baseBundle = 'skyline.components.scss';
  await generate(
    ['**/*.scss', '!**/*.vars.scss', '!**/*.mixins.scss', '!**/*.ios.scss', '!**/*.md.scss'],
    srcDir,
    `${ bundleDir }/${ baseBundle }`,
  );
  logger.clear(`GEN ${ baseBundle }`);

  const iosBundle = 'skyline.components.ios.scss';
  await generate(
    ['**/*.ios.scss', '!**/*.vars.scss', '!**/*.mixins.scss'],
    srcDir,
    `${ bundleDir }/${ iosBundle }`,
    [baseBundle],
  );
  logger.clear(`GEN ${ iosBundle }`);

  const mdBundler = 'skyline.components.md.scss';
  await generate(
    ['**/*.md.scss', '!**/*.vars.scss', '!**/*.mixins.scss'],
    srcDir,
    `${ bundleDir }/${ mdBundler }`,
    [baseBundle],
  );
  logger.clear(`GEN ${ mdBundler }`);

  const bundles = [
    // default bundle
    resolve(`src/style/${ defaultBundle }`),
    `${ bundleDir }/${ baseBundle }`,
    `${ bundleDir }/${ iosBundle }`,
    `${ bundleDir }/${ mdBundler }`,
  ];

  let files;

  // build components
  const components = fs.readdirSync(srcDir)
    .filter(p => fs.statSync(`${ srcDir }/${ p }`).isDirectory());

  for (const name of components) {
    const cwd = `${ srcDir }/${ name }`;
    files = await globby(['**/*.scss', '!**/*.vars.scss', '!**/*.mixins.scss'], { cwd });
    files = files.map(f => `${ cwd }/${ f }`);

    await build(files, `${ distDir }/${ name }`, false);
  }

  // build bundles
  await build(bundles, distDir);
}

async function generate(patterns, folder, dist, deps = []) {
  const files = await globby(patterns, { cwd: folder });
  const imports = files.sort().map(file => {
    // relative path
    const relative = path.relative(path.dirname(dist), folder);
    const from = path.join(relative, file.replace('.scss', ''))
      .replace(/\\+/g, '/');
    return `@import "${ from }";`;
  });

  deps = deps.sort().map(file => {
    return `@import "./${ file.replace('.scss', '') }";`;
  });

  let code = `${ warning }\n`;

  if (deps.length) {
    code += deps.join('\n');
    code += '\n\n';
  }

  if (imports.length) {
    code += imports.join('\n');
    code += '\n';

    await fs.ensureFile(dist);
    await fs.writeFile(dist, code);
  }

  return files;
}

async function build(files, distDir, check = true) {
  const targets = [];

  for (const file of files) {
    logger.clear(`RENDER  ${ path.relative(packageDir, path.normalize(file)) }`);

    const rendered = await renderScss(file);

    const autoprefixed = await autoprefix.process(rendered.css, { from: undefined });

    const filename = path.basename(file, '.scss');

    await fs.ensureDir(distDir);
    await fs.writeFile(
      `${ distDir }/${ filename }.css`,
      autoprefixed.css,
    );

    const minimized = await nano.process(autoprefixed.css, { from: undefined });

    await fs.writeFile(
      `${ distDir }/${ filename }.min.css`,
      minimized.css,
    );

    targets.push(filename);
  }

  if (targets.length) {
    logger.clear();
  }

  if (check && targets.length) {
    logger.log();
    checkAllSizes(targets, distDir);
  }
}

function renderScss(file) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file,
        importer : [
          (url, prev, done) => {
            let file;

            switch (true) {
              case /skyline\//.test(url):
                // replace @ with src
                file = path.resolve(packageDir, url.replace('skyline/', 'src/'));
                break;
              default:
                // resolve directly
                file = path.resolve(styleDir, url);
                break;
            }

            done({ file });
          },
        ],
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      },
    );
  });
}

function checkAllSizes(targets, distDir) {
  for (const target of targets) {
    try {
      checkSize(target, distDir);
    } catch (error) {
      logger.error(target, distDir);
      throw error;
    }
  }
}

function checkSize(target, distDir) {
  const dist = `${ distDir }/${ target }.min.css`;
  if (fs.existsSync(dist)) {
    const file = fs.readFileSync(dist);
    const minSize = `${ (file.length / 1024).toFixed(2) }kb`;
    const gzipped = gzipSync(file);
    const gzippedSize = `${ (gzipped.length / 1024).toFixed(2) }kb`;
    const compressed = compress(file) || [];
    const compressedSize = `${ (compressed.length / 1024).toFixed(2) }kb`;
    logger.log(
      `${ chalk.gray(
        chalk.bold(target),
      ).padEnd(25) } min:${ minSize } / gzip:${ gzippedSize } / brotli:${ compressedSize }`,
    );
  }
}
