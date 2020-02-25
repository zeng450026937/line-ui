const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

const packageDir = path.resolve(__dirname, '../../');
const resolve = p => path.resolve(packageDir, p);

const distDir = resolve('src/themes');

const warning = require('./warning');

run();

async function run() {
  const root = resolve('src/components');

  let files;
  let distFile;

  distFile = 'skyline.components.scss';
  files = await generate(
    ['**/*.scss', '!**/*.vars.scss', '!**/*.mixins.scss', '!**/*.ios.scss', '!**/*.md.scss'],
    root,
    `${ distDir }/${ distFile }`,
  );

  console.log();
  console.log(`${ distFile } :  ${ files.length } components`);

  distFile = 'skyline.components.ios.scss';
  files = await generate(
    ['**/*.ios.scss', '!**/*.vars.scss', '!**/*.mixins.scss'],
    root,
    `${ distDir }/skyline.components.ios.scss`,
    ['skyline.components.scss'],
  );

  console.log(`${ distFile } :  ${ files.length } components`);

  distFile = 'skyline.components.md.scss';
  files = await generate(
    ['**/*.md.scss', '!**/*.vars.scss', '!**/*.mixins.scss'],
    root,
    `${ distDir }/skyline.components.md.scss`,
    ['skyline.components.scss'],
  );

  console.log(`${ distFile } :  ${ files.length } components`);
}

async function generate(patterns, folder, dist, deps = []) {
  const files = await globby(patterns, { cwd: folder });
  const imports = files.sort().map(file => {
    // const from = `@/components/${ file.replace('.scss', '') }`;

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
