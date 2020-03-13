const fs = require('fs-extra');
const path = require('path');
const globRE = require('glob-to-regexp');

const packageDir = path.resolve(__dirname, '../');
const resolve = p => path.resolve(packageDir, p);

const wips = fs.readFileSync(resolve('.wip'), 'utf-8')
  .split('\n')
  .filter(Boolean);

const matchWIP = exports.matchWIP = (target) => {
  target = path.normalize(target).split('\\').join('/');
  let matched = false;
  for (const wip of wips) {
    if (globRE(`*${ wip }`).test(target)) {
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

// stable stringify with alphabetically
exports.stringifyJSON = (obj, ...args) => {
  const keys = [];
  /* eslint-disable guard-for-in */
  for (const key in obj) {
    keys.push(key);
  }
  /* eslint-enable guard-for-in */
  keys.sort();
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return JSON.stringify(newObj, ...args);
};
