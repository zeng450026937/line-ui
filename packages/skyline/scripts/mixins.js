const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);

const warning = require('./warning');
const logger = require('./logger');

const { matchWIP } = require('./utils');

let count = 0;
const skipped = [];

run();

async function run() {
  logger.log();
  logger.log('mixins', 'GEN');

  const root = resolve('src/mixins');
  const files = await globby(['*.ts', '!*-legacy.ts'], { cwd: root });

  let code = `${ warning }\n`;

  for (const file of files) {
    if (matchWIP(`${ root }/${ file }/`)) {
      skipped.push(file);
      logger.log(`${ file } (skipped)`, 'WIP');
      continue;
    }
    const filename = path.basename(file, '.ts');
    code += `export * from 'skyline/src/mixins/${ filename }';\n`;
    count++;
  }

  logger.log(`total :  ${ count } mixins`, 'DONE');

  // const dist = resolve(`${ root }/index.ts`);
  // const dist = resolve('gen/mixins/index.ts');
  const dist = resolve('src/mixins.ts');

  await fs.ensureFile(dist);
  await fs.writeFile(dist, code);
}
