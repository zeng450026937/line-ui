/* eslint-disable
@typescript-eslint/camelcase,
operator-linebreak
*/
import fs from 'fs';
import path from 'path';
import ts from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import noderesolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import buble from '@rollup/plugin-buble';
import alias from '@rollup/plugin-alias';

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.');
}

const masterVersion = require('./package.json').version;

const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET);
const name = path.basename(packageDir);
const resolve = (p) => path.resolve(packageDir, p);
const pkg = require(resolve('package.json'));
const packageOptions = pkg.buildOptions || {};

const knownExternals = fs.readdirSync(packagesDir).filter((p) => {
  return p !== '@line-ui/utils';
});

// ensure TS checks only once for each build
let hasTSChecked = false;

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es',
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife',
  },
  umd: {
    file: resolve(`dist/${name}.umd.js`),
    format: 'umd',
  },
};

const defaultFormats = ['esm-bundler', 'cjs'];
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',');
const packageFormats =
  inlineFormats || packageOptions.formats || defaultFormats;
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map((format) => createConfig(format, outputConfigs[format]));

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach((format) => {
    if (format === 'cjs' && packageOptions.prod !== false) {
      packageConfigs.push(createProductionConfig(format));
    }
    if (/^(global|esm-browser|umd)(-runtime)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format));
    }
  });
}

export default packageConfigs;

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`));
    process.exit(1);
  }

  output.sourcemap = !!process.env.SOURCE_MAP || packageOptions.sourcemap;
  output.externalLiveBindings = false;

  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file);
  const isBundlerESMBuild = /esm-bundler/.test(format);
  const isBrowserESMBuild = /esm-browser/.test(format);
  const isNodeBuild = format === 'cjs';
  const isGlobalBuild = /global/.test(format);

  if (isGlobalBuild) {
    output.name = packageOptions.name;
  }

  const shouldEmitDeclarations =
    process.env.TYPES != null &&
    process.env.NODE_ENV === 'production' &&
    !hasTSChecked;

  const resolvedPlugins = [];

  const {
    alias: enableAlias = true,
    nodemodule: enableNodeModule = true,
    json: enableJson = true,
    typescript: enableTypescript = true,
    replace: enableReplace = true,
    babel: enableBabel = false,
    buble: enableBuble = false,
  } = packageOptions;

  if (enableAlias) {
    resolvedPlugins.push(
      alias({
        entries: {
          [name]: packageDir,
        },
      })
    );
  }

  if (enableNodeModule) {
    resolvedPlugins.push(
      noderesolve({
        browser: !isNodeBuild,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs({})
    );
  }

  if (enableJson) {
    resolvedPlugins.push(
      json({
        namedExports: false,
      })
    );
  }

  if (enableTypescript) {
    resolvedPlugins.push(
      ts({
        check: process.env.NODE_ENV === 'production' && !hasTSChecked,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: output.sourcemap,
            declaration: shouldEmitDeclarations,
            declarationMap: shouldEmitDeclarations,
          },
          exclude: ['**/__tests__', 'test-dts', '**/test', 'src', 'tests'],
        },
      })
    );
    // we only need to check TS and generate declarations once for each build.
    // it also seems to run into weird issues when checking multiple times
    // during a single build.
    hasTSChecked = true;
  }

  if (enableReplace) {
    resolvedPlugins.push(
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        // isBrowserBuild?
        (isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild) &&
          !packageOptions.enableNonBrowserBranches,
        isNodeBuild
      )
    );
  }

  if (enableBabel) {
    resolvedPlugins.push(
      babel({
        extensions: ['.jsx', '.tsx'],
        exclude: 'node_modules/**',
        babelrc: false,
        root: packageDir,
        rootMode: 'upward',
        runtimeHelpers: true,
        compact: false,
      })
    );
  }

  if (enableBuble) {
    resolvedPlugins.push(
      buble({
        objectAssign: true,
      })
    );
  }

  const fileExt = enableTypescript ? 'ts' : 'js';
  const entryFile = `src/index.${fileExt}`;

  const external =
    isGlobalBuild || isBrowserESMBuild
      ? []
      : knownExternals.concat(Object.keys(pkg.dependencies || []));

  // always external vue
  external.push('vue');

  if (isGlobalBuild) {
    output.globals = { vue: 'Vue' };
  }

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [...resolvedPlugins, ...plugins],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
  };
}

function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isBrowserBuild,
  isNodeBuild
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${masterVersion}"`,
    __DEV__: isBundlerESMBuild
      ? // preserve to be handled by bundlers
        "(process.env.NODE_ENV !== 'production')"
      : // hard coded dev/prod builds
        !isProduction,
    // this is only used during tests
    __TEST__: isBundlerESMBuild ? "(process.env.NODE_ENV === 'test')" : false,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: isBrowserBuild,
    // is targeting bundlers?
    __BUNDLER__: isBundlerESMBuild,
    // is targeting Node (SSR)?
    __NODE_JS__: isNodeBuild,
  };
  // allow inline overrides like
  // __RUNTIME_COMPILE__=true yarn build runtime-core
  Object.keys(replacements).forEach((key) => {
    if (key in process.env) {
      replacements[key] = process.env[key];
    }
  });
  return replace(replacements);
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format,
  });
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser');
  return createConfig(
    format,
    {
      file: resolve(`dist/${name}.${format}.prod.js`),
      format: outputConfigs[format].format,
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
        output: {
          comments: false,
        },
      }),
    ]
  );
}
