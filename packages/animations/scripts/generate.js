const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

const packageDir = path.resolve(__dirname, '..');
const resolve = p => path.resolve(packageDir, p);

const folderName = 'css';
const folder = resolve(folderName);

const distFolder = 'gen';

run();

async function run() {
  await fs.emptyDir(resolve(distFolder));

  await generate(
    ['*.css', '!*In*.css', '!*Out*.css'],
    resolve(`${ distFolder }/general-animations.ts`),
    '// general animations',
  );

  await generate(
    ['*In*.css'],
    resolve(`${ distFolder }/in-animations.ts`),
    '// in animations',
  );

  await generate(
    ['*Out*.css'],
    resolve(`${ distFolder }/out-animations.ts`),
    '// out animations',
  );

  const files = await globby(['*.ts'], { cwd: resolve(distFolder) });
  const filenames = files.sort()
    .filter(file => !/index/.test(file))
    .map(file => path.basename(file, '.ts'));
  const dist = resolve('src/index.ts');

  if (filenames.length) {
    await fs.ensureFile(dist);
    await fs.writeFile(dist, `
${ filenames.map(name => `import '../gen/${ name }';`).join('\n') }
`.trimLeft());
  }
}

async function generate(patterns, dist, banner = '') {
  const files = await globby(patterns, { cwd: folder });
  const filenames = files.sort().map(file => path.basename(file));

  if (filenames.length) {
    await fs.ensureFile(dist);
    await fs.writeFile(dist, `
${ banner }

${ filenames.map(name => `import '../${ folderName }/${ name }';`).join('\n') }
`.trimLeft());
  }

  console.log(`${ path.basename(dist).padEnd(25, ' ') } \t ${ files.length } animations`);
}
