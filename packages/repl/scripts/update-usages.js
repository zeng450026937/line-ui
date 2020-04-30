const glob = require('glob');
const path = require('path');
const fs = require('fs');

const pkgsDir = path.resolve(__dirname, '../../');
const pkgDir = `${pkgsDir}/repl`;
const targetDir = `${pkgsDir}/line/src/components`;

main();

function main() {
  const components = glob.sync('*', { cwd: targetDir });
  const usages = components.map((c) => {
    const files = glob.sync('*.vue', { cwd: `${targetDir}/${c}/usage` });
    return [c, files.map((f) => path.basename(f, '.vue'))];
  });
  const code = `
// Auto Generated
// This file is auto generated, do not modify directly.

/* eslint-disable */
export default {
  ${usages
    .map(
      ([name, files]) => `${JSON.stringify(name)}: ${JSON.stringify(files)},`
    )
    .join('\n  ')}
};
`.trimLeft();

  fs.writeFileSync(`${pkgDir}/src/usages.ts`, code);
}
