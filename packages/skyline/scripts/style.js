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
const relative = (from, to) => path.relative(from, to).split('\\').join('/');

const args = require('minimist')(process.argv.slice(2));

const buildAll = args.all || args.a || args._.length === 0;
const genBundle = args.gen || buildAll;
const buildBundle = args.bundle || buildAll;
const buildComp = args.comp || buildAll;
const clearDist = args.clear || buildAll;
const distFolder = args.dist || args.d;

const pkgName = require(resolve('package.json')).name;
const srcDir = resolve('src/components');
const distDir = resolve(distFolder || 'style');

const styleDir = resolve('src/components');
const bundleDir = resolve('src/style');

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

const { camelize } = require('./utils');
const warning = require('./warning');
const logger = require('./logger');

run();

async function run() {
  if (clearDist) {
    await fs.remove(distDir);
  }

  const themes = {
    base : '.scss',
    ios  : '.ios.scss',
    md   : '.md.scss',
  };
  const styles = {};
  const sideEffects = {};
  const components = await globby(['**/*.tsx'], { cwd: srcDir, deep: 2 });

  let baseStyles = [];
  let iosStyles = [];
  let mdStyles = [];

  for (const component of components) {
    const dirname = path.dirname(component);
    const filename = path.basename(component, '.tsx');
    const name = camelize(`-${ filename }`);

    styles[name] = {};
    sideEffects[name] = {};

    Object.keys(themes).forEach(async (theme) => {
      const ext = themes[theme];
      const stylename = `${ filename }${ ext }`;
      const stylefile = `${ srcDir }/${ dirname }/${ stylename }`;
      const exsit = fs.existsSync(stylefile);
      const distdir = `${ distDir }/${ dirname }`;

      if (!exsit) return;

      styles[name][theme] = stylefile;

      if (buildComp) {
        await build(stylefile, distdir, false);
      }

      sideEffects[name][theme] = effectPath(distdir, stylename);
    });

    const {
      base: baseStyle,
      ios: iosStyle,
      md: mdStyle,
    } = styles[name];

    baseStyles.push(baseStyle);
    iosStyles.push(iosStyle || baseStyle);
    mdStyles.push(mdStyle || baseStyle);
  }

  baseStyles = baseStyles.filter(Boolean);
  iosStyles = iosStyles.filter(Boolean);
  mdStyles = mdStyles.filter(Boolean);

  // bundles
  const defaultBundle = `${ pkgName }.bundle.scss`;
  const baseBundle = `${ pkgName }.scss`;
  const iosBundle = `${ pkgName }.ios.scss`;
  const mdBundler = `${ pkgName }.md.scss`;

  // gen bundles
  if (genBundle) {
    await generate(
      baseStyles,
      `${ bundleDir }/${ baseBundle }`,
    );
    await generate(
      iosStyles,
      `${ bundleDir }/${ iosBundle }`,
    );
    await generate(
      mdStyles,
      `${ bundleDir }/${ mdBundler }`,
    );
  }

  const bundles = [
    `${ bundleDir }/${ baseBundle }`,
    `${ bundleDir }/${ iosBundle }`,
    `${ bundleDir }/${ mdBundler }`,
  ];

  // build bundles
  if (buildBundle) {
    [
      `${ bundleDir }/${ defaultBundle }`,
      ...bundles,
    ].forEach(async (bundle) => {
      await build(bundle, distDir);
    });
  }

  // DEFAULT EFFECTS
  sideEffects[camelize(`-${ pkgName }`)] = {
    base : effectPath(distDir, baseBundle),
    ios  : effectPath(distDir, iosBundle),
    md   : effectPath(distDir, mdBundler),
  };

  // BUNDLE EFFECTS
  sideEffects.bundle = effectPath(distDir, defaultBundle);

  await fs.writeJSON(
    `${ distDir }/sideEffect.json`,
    sideEffects,
    { spaces: 2 },
  );
}

function effectPath(distDir, filename) {
  return `${ pkgName }/${ relative(packageDir, distDir) }/${ path.basename(filename, '.scss') }.css`;
}

async function generate(files, dist, deps = []) {
  const imports = files.sort().map(file => {
    // relative path
    const dir = relative(path.dirname(dist), path.dirname(file));
    const from = `${ dir || '.' }/${ path.basename(file, '.scss') }`;
    return `@import "${ from }";`;
  });

  deps = Array.isArray(deps) ? deps : [deps];
  deps = deps.sort().map(file => {
    const dir = relative(path.dirname(dist), path.dirname(file));
    const from = `${ dir || '.' }/${ path.basename(file, '.scss') }`;
    return `@import "${ from }";`;
  });

  let code = `${ warning }\n`;

  if (deps.length) {
    code += deps.join('\n');
    code += '\n\n';
  }

  if (imports.length) {
    code += imports.join('\n');
    code += '\n';
  }

  await fs.ensureFile(dist);
  await fs.writeFile(dist, code);
}

async function build(file, distDir, check = true) {
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

  logger.clear();

  if (check) {
    checkSize(filename, distDir);
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
