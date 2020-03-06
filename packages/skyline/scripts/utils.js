const fs = require('fs-extra');
const path = require('path');

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);

const wips = fs.readFileSync(resolve('.wip'), 'utf-8')
  .split('\n')
  .filter(Boolean);

const matchWIP = exports.matchWIP = (target) => {
  target = path.normalize(target).split('\\').join('/');
  let matched = false;
  for (const wip of wips) {
    if (new RegExp(`${ wip }`).test(target)) {
      matched = true;
      break;
    }
  }
  return matched;
};

exports.filterWIPTarget = (allTargets) => {
  return allTargets.filter(target => !matchWIP(target));
};

const camelizeRE = /-(\w)/g;
exports.camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
