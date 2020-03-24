/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "dom":
yarn build dom

# specify the format to output
yarn build core --formats cjs
```
*/

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const { gzipSync } = require('zlib');
const { compress } = require('brotli');
const { targets: allTargets, fuzzyMatchTarget } = require('./utils');

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
const prepare = args.prepare || isRelease;
const scripts = args.scripts || isRelease;
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7);

run();

async function run() {
  if (!targets.length) {
    await buildAll(allTargets);
    checkAllSizes(allTargets);
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching));
    checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching));
  }
}

async function buildAll(targets) {
  for (const target of targets) {
    await build(target);
  }
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${ target }`);
  const resolve = p => path.resolve(pkgDir, p);
  const pkg = require(resolve('package.json'));

  // only build published packages for release
  if (isRelease && pkg.private) {
    return;
  }

  // if building a specific format, do not remove dist.
  if (!formats) {
    await fs.remove(resolve('dist'));
  }

  const configFile = resolve('rollup.config.js');
  const hasConfig = await fs.exists(configFile);

  const env = (pkg.buildOptions && pkg.buildOptions.env)
    || (devOnly ? 'development' : 'production');

  // STAGE: prepare
  if (prepare && pkg.buildOptions && pkg.buildOptions.prepare) {
    console.log();
    console.log(
      `${ chalk.bold(chalk.bgBlue(' STAGE ')) }${ chalk.bgGray(' PREPARE ') }`,
    );
    const scripts = [].concat(pkg.buildOptions.prepare);
    for (const script of scripts) {
      await execa(
        'node',
        [resolve(script)],
        {
          stdio : 'inherit',
          cwd   : pkgDir,
          env   : {
            COMMIT   : `${ commit }`,
            NODE_ENV : `${ env }`,
          },
        },
      );
    }
  }

  // STAGE: build
  console.log();
  console.log(
    `${ chalk.bold(chalk.bgBlue(' STAGE ')) }${ chalk.bgGray(' BUILD ') }`,
  );
  await execa(
    'rollup',
    [
      '-c',
      ...(hasConfig ? [configFile] : []),
      '--environment',
      [
        `COMMIT:${ commit }`,
        `NODE_ENV:${ env }`,
        `TARGET:${ target }`,
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

  // STAGE: types
  if (buildTypes && pkg.types) {
    console.log();
    console.log(
      `${ chalk.bold(chalk.bgBlue(' STAGE ')) }${ chalk.bgGray(' TYPES ') }`,
    );
    console.log();
    console.log(
      chalk.bold(chalk.yellow(`Rolling up type definitions for ${ target }...`)),
    );

    // build types
    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

    const extractorConfigPath = resolve('api-extractor.json');
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(
      extractorConfigPath,
    );
    const result = Extractor.invoke(extractorConfig, {
      localBuild          : true,
      showVerboseMessages : true,
    });

    if (result.succeeded) {
      // concat additional d.ts to rolled-up dts (mostly for JSX)
      if (pkg.buildOptions && pkg.buildOptions.dts) {
        const dtsPath = resolve(pkg.types);
        const existing = await fs.readFile(dtsPath, 'utf-8');
        const toAdd = await Promise.all(
          pkg.buildOptions.dts.map(file => {
            return fs.readFile(resolve(file), 'utf-8');
          }),
        );
        await fs.writeFile(dtsPath, `${ existing }\n${ toAdd.join('\n') }`);
      }
      console.log(
        chalk.bold(chalk.green('API Extractor completed successfully.')),
      );
    } else {
      console.error(
        `API Extractor completed with ${ result.errorCount } errors`
          + ` and ${ result.warningCount } warnings`,
      );
      process.exitCode = 1;
    }

    await fs.remove(resolve('dist/packages'));
  }

  // STAGE: scripts
  if (scripts && pkg.buildOptions && pkg.buildOptions.scripts) {
    console.log();
    console.log(
      `${ chalk.bold(chalk.bgBlue(' STAGE ')) }${ chalk.bgGray(' SCRIPTS ') }`,
    );
    const scripts = [].concat(pkg.buildOptions.scripts);
    for (const script of scripts) {
      await execa(
        'node',
        [
          resolve(script),
          `${ isRelease ? '--release' : '' }`,
        ].filter(Boolean),
        {
          stdio : 'inherit',
          cwd   : pkgDir,
          env   : {
            COMMIT   : `${ commit }`,
            NODE_ENV : `${ env }`,
          },
        },
      );
    }
  }
}

function checkAllSizes(targets) {
  if (devOnly) {
    return;
  }
  console.log();
  for (const target of targets) {
    checkSize(target);
  }
  console.log();
}

function checkSize(target) {
  const pkgDir = path.resolve(`packages/${ target }`);
  const esmProdBuild = `${ pkgDir }/dist/${ target }.global.prod.js`;
  if (fs.existsSync(esmProdBuild)) {
    const file = fs.readFileSync(esmProdBuild);
    const minSize = `${ (file.length / 1024).toFixed(2) }kb`;
    const gzipped = gzipSync(file);
    const gzippedSize = `${ (gzipped.length / 1024).toFixed(2) }kb`;
    const compressed = compress(file);
    const compressedSize = `${ (compressed.length / 1024).toFixed(2) }kb`;
    console.log(
      `${ chalk.gray(
        chalk.bold(target),
      ) } min:${ minSize } / gzip:${ gzippedSize } / brotli:${ compressedSize }`,
    );
  }
}
