/*
eslint-disable
global-require,
import/no-dynamic-require,
no-use-before-define,
no-await-in-loop,
operator-linebreak,
consistent-return,
*/

const fs = require('fs');
const chalk = require('chalk');

const targets = (exports.targets = fs.readdirSync('packages').filter(f => {
  if (!fs.statSync(`packages/${ f }`).isDirectory()) {
    return false;
  }
  const pkg = require(`../packages/${ f }/package.json`);
  if (pkg.private && !pkg.buildOptions) {
    return false;
  }
  return true;
}));

exports.fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = [];
  partialTargets.forEach(partialTarget => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target);
        if (!includeAllMatching) {
          break;
        }
      }
    }
  });
  if (matched.length) {
    return matched;
  }
  console.log();
  console.error(
    `  ${ chalk.bgRed.white(' ERROR ') } ${ chalk.red(
      `Target ${ chalk.underline(partialTargets) } not found!`,
    ) }`,
  );
  console.log();

  process.exit(1);
};
