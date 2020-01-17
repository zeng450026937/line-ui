/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const { parallel } = require('./parallel');

const camelizeRE = /-(\w)/g;
const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

async function componentEntry(dir) {
  const patterns = ['**/*.tsx'];
  const files = await globby(patterns, { cwd: dir, deep: 1 });
  const filenames = files.map((file) => path.basename(file, '.tsx'));

  if (files.length) {
    await fs.writeFile(path.resolve(dir, 'index.ts'),
      `/* eslint-disable sort-imports, object-curly-newline */
${ filenames.map(name => `import ${ camelize(`-${ name }`) } from '@/components/${ path.basename(dir) }/${ name }'`).join(';\n') };

export { ${ filenames.map(name => camelize(`-${ name }`)).join(', ') } };
`);
  }

  return filenames;
}

async function componentWalker() {
  const dir = path.resolve(process.cwd(), 'src/components');
  const folders = await fs.readdir(dir);

  const files = await parallel(
    folders.map(
      folder => () => componentEntry(path.resolve(dir, folder)),
    ),
    8,
  );

  // filter out empty folder
  const components = folders.reduce((pre, cur, index) => {
    const filelist = files[index];
    if (filelist.length) {
      pre[cur] = filelist;
    }
    return pre;
  }, {});

  const componentlist = folders.reduce((pre, cur, index) => pre.concat(files[index]), []);

  await fs.writeFile(path.resolve(process.cwd(), 'src/components.ts'),
    `/* eslint-disable sort-imports, object-curly-newline */

${ Object.keys(components).map(key => {
    return `import(/* webpackChunkName: "${ key }" */ '@/components/${ key }');`;
  }).join('\n') }
`);

  await fs.writeFile(path.resolve(process.cwd(), 'src/main.ts'),
    `/* eslint-disable sort-imports, object-curly-newline */
import { VueConstructor } from 'vue';

import '@/style/skyline.bundle.scss';
import '@/themes/skyline.globals.scss';
import '@/themes/skyline.globals.ios.scss';

${ Object.entries(components).map(([key, value]) => {
    return `import { ${ value.map(name => camelize(`-${ name }`)).join(', ') } } from '@/components/${ key }';`;
  }).join('\n') }

const install = (Vue: VueConstructor) => {
  ${ Object.entries(components).map(([key, value]) => {
    return `${ value.map(name => `Vue.use(${ camelize(`-${ name }`) })`).join(';\n  ') }`;
  }).join(';\n  ') };
};

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const version = process.env.VUE_APP_VERSION;

export default {
  install,
  version,

  ${ componentlist.map(name => camelize(`-${ name }`)).join(',\n  ') },
};
`);
}

componentWalker();
