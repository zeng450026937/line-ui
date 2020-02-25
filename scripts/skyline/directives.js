const fs = require('fs-extra');
const path = require('path');

const packageDir = path.resolve(__dirname, '../../');
const resolve = p => path.resolve(packageDir, p);

const warning = require('./warning');

run();

async function run() {
  const root = resolve('src/directives');
  const folders = fs.readdirSync(root)
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
    code += `export * from '@/directives/${ folder }';\n`;
  }

  console.log();
  console.log(`total :  ${ folders.length } directives`);

  // const dist = resolve(`${ root }/index.ts`);
  // const dist = resolve('gen/directives/index.ts');
  const dist = resolve('src/directives.ts');

  await fs.ensureFile(dist);
  await fs.writeFile(dist, code);
}
