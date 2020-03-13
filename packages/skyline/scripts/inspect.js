const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);
const relative = (from, to) => path.relative(from, to).split('\\').join('/');

const { camelize } = require('./utils');
const logger = require('./logger');

const componentsDir = resolve('src/components');
const directivesDir = resolve('src/directives');
const mixinsDir = resolve('src/mixins');

const prefix = process.env.PREFIX || 'line';

run();

async function run() {
  logger.log();

  const components = await inspectComponents();
  const directives = await inspectDirectives();
  const mixins = await inspectMixins();
  const styles = await inspectStyles();

  await fs.writeJSON(
    resolve('dist/inspect.json'),
    {
      components,
      directives,
      mixins,
      styles,
    },
    { spaces: 2 },
  );

  logger.done(resolve('dist/inspect.json'));
}

async function inspectComponents() {
  const files = await globby(['**/*.tsx'], { cwd: componentsDir });
  const components = files.sort().map(file => {
    const filename = path.basename(file, '.tsx');
    const name = camelize(`-${ filename }`);
    const style = {
      default : `${ file.replace('.tsx', '.scss') }`,
      ios     : `${ file.replace('.tsx', '.ios.scss') }`,
      md      : `${ file.replace('.tsx', '.md.scss') }`,
    };
    const hasDefault = fs.existsSync(`${ componentsDir }/${ style.default }`);
    const hasIOS = fs.existsSync(`${ componentsDir }/${ style.ios }`);
    const hasMD = fs.existsSync(`${ componentsDir }/${ style.md }`);
    return {
      name,
      tags : [
        `${ prefix }-${ filename }`,
        `${ camelize(`-${ prefix }-${ filename }`) }`,
      ],
      style : {
        default : hasDefault
          ? relative(packageDir, `${ componentsDir }/${ style.default }`)
          : '',
        ios : hasIOS
          ? relative(packageDir, `${ componentsDir }/${ style.ios }`)
          : hasDefault
            ? relative(packageDir, `${ componentsDir }/${ style.default }`)
            : '',
        md : hasMD
          ? relative(packageDir, `${ componentsDir }/${ style.md }`)
          : hasDefault
            ? relative(packageDir, `${ componentsDir }/${ style.default }`)
            : '',
      },
      scss : {
        default : hasDefault
          ? relative(packageDir, `${ componentsDir }/${ style.default }`)
          : '',
        ios : hasIOS
          ? relative(packageDir, `${ componentsDir }/${ style.ios }`)
          : hasDefault
            ? relative(packageDir, `${ componentsDir }/${ style.default }`)
            : '',
        md : hasMD
          ? relative(packageDir, `${ componentsDir }/${ style.md }`)
          : hasDefault
            ? relative(packageDir, `${ componentsDir }/${ style.default }`)
            : '',
      },
      theme : {
        default : hasDefault,
        ios     : hasIOS,
        md      : hasMD,
      },
    };
  });
  return components;
}

async function inspectDirectives() {
  const folders = fs.readdirSync(directivesDir)
    .filter(f => {
      if (!fs.statSync(`${ directivesDir }/${ f }`).isDirectory()) {
        return false;
      }
      if (!fs.existsSync(`${ directivesDir }/${ f }/index.ts`)) {
        return false;
      }
      return true;
    });
  const directives = folders.sort().map(folder => {
    return {
      name : `v-${ folder }`,
    };
  });
  return directives;
}

async function inspectMixins() {
  const files = await globby(['*.ts', '!*-legacy.ts'], { cwd: mixinsDir });
  const mixins = files.sort().map(file => {
    const filename = path.basename(file, '.ts');
    return {
      name : camelize(filename),
    };
  });
  return mixins;
}

async function inspectStyles() {
  return {
    bundle     : 'style/skyline.bundle.scss',
    components : {
      base : 'style/skyline.scss',
      ios  : 'style/skyline.ios.scss',
      md   : 'style/skyline.md.scss',
    },
    default : {
      base : 'themes/skyline.globals.scss',
      ios  : 'themes/skyline.globals.ios.scss',
      md   : 'themes/skyline.globals.md.scss',
    },
    theme : {
      base : 'themes/skyline.theme.default.scss',
      ios  : 'themes/skyline.theme.default.ios.scss',
      md   : 'themes/skyline.theme.default.md.scss',
    },
  };
}
