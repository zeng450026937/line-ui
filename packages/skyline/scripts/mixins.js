const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);

const warning = require('./warning');
const logger = require('./logger');

run();

async function run() {
  const root = resolve('src/mixins');
  const files = await globby(['*.ts', '!*-legacy.ts'], { cwd: root });

  let code = `${ warning }\n`;

  for (const file of files) {
    const filename = path.basename(file, '.ts');
    code += `export * from 'skyline/mixins/${ filename }';\n`;
  }

  logger.log();
  logger.done(`total :  ${ files.length } mixins`);

  // const dist = resolve(`${ root }/index.ts`);
  // const dist = resolve('gen/mixins/index.ts');
  const dist = resolve('src/mixins.ts');

  await fs.ensureFile(dist);
  await fs.writeFile(dist, code);
}
