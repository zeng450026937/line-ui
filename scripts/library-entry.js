/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const { parallel } = require('./parallel');

const camelizeRE = /-(\w)/g;
const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

async function libraryEntry(dir) {
  const fs = require('fs-extra');
  const path = require('path');
  const globby = require('globby');
  const patterns = ['**/*.tsx'];
  const files = await globby(patterns, { cwd: dir, deep: 1 });
  const filenames = files.map((file) => path.basename(file, '.tsx'));

  if (!files.length) return;

  await fs.writeFile(path.resolve(dir, 'index.ts'),
    `${ filenames.map(name => `import ${ camelize(`-${ name }`) } from '@/components/${ path.basename(dir) }/${ name }'`).join(';\n') };

export { ${ filenames.map(name => camelize(`-${ name }`)).join(', ') } };
`);
}

async function libraryIndex() {
  const fs = require('fs-extra');
  const path = require('path');
  const dir = path.resolve(process.cwd(), 'src/components');
  const folders = await fs.readdir(dir);

  await parallel(
    folders.map(
      folder => () => libraryEntry(path.resolve(dir, folder)),
    ),
    8,
  );
}

// module.exports = libraryEntry;
libraryIndex();
