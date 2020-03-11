const fs = require('fs-extra');
const path = require('path');

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
  logger.log('directives', 'GEN');

  const root = resolve('src/directives');
  const folders = fs.readdirSync(root)
    .sort()
    .filter(f => {
      if (!fs.statSync(`${ root }/${ f }`).isDirectory()) {
        return false;
      }
      if (!fs.existsSync(`${ root }/${ f }/index.ts`)) {
        return false;
      }
      return true;
    });

  let code = `${ warning }\n`;

  for (const folder of folders) {
    if (matchWIP(`${ root }/${ folder }`)) {
      skipped.push(folder);
      logger.log(`${ folder } (skipped)`, 'WIP');
      continue;
    }
    code += `export * from 'skyline/directives/${ folder }';\n`;
    count++;
  }

  logger.done(`total :  ${ count } directives`);

  // const dist = resolve(`${ root }/index.ts`);
  // const dist = resolve('gen/directives/index.ts');
  const dist = resolve('src/directives.ts');

  await fs.ensureFile(dist);
  await fs.writeFile(dist, code);
}
