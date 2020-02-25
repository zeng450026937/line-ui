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

const packageDir = path.resolve(__dirname, '../../');
const resolve = p => path.resolve(packageDir, p);

const srcDir = resolve('src/components');
const distDir = resolve('dist/style');

const styleDir = resolve('src/components');

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

run();

async function run() {
  let files;

  // build bundles
  files = [
    resolve('src/style/skyline.bundle.scss'),
    resolve('src/themes/skyline.components.scss'),
    resolve('src/themes/skyline.components.ios.scss'),
    resolve('src/themes/skyline.components.md.scss'),
  ];

  await build(files, distDir);

  // build components
  const components = fs.readdirSync(srcDir)
    .filter(p => fs.statSync(`${ srcDir }/${ p }`).isDirectory());

  for (const name of components) {
    const cwd = `${ srcDir }/${ name }`;
    files = await globby(['**/*.scss', '!**/*.vars.scss', '!**/*.mixins.scss'], { cwd });
    files = files.map(f => `${ cwd }/${ f }`);

    await build(files, `${ distDir }/${ name }`, true);
  }
}

async function build(files, distDir, check = true) {
  const targets = [];

  for (const file of files) {
    console.log('rendering...', file);

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

  if (check && targets.length) {
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
              case /@\//.test(url):
                // replace @ with src
                file = path.resolve(packageDir, url.replace('@/', 'src/'));
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
  console.log();
  for (const target of targets) {
    try {
      checkSize(target, distDir);
    } catch (error) {
      console.log(target, distDir);
      throw error;
    }
  }
  console.log();
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
    console.log(
      `${ chalk.gray(
        chalk.bold(target),
      ).padEnd(25) } min:${ minSize } / gzip:${ gzippedSize } / brotli:${ compressedSize }`,
    );
  }
}
