const qs = require('querystring');
const { getOptions } = require('loader-utils');
const parse = require('./parse');
const codegen = require('./codegen');

const templateRE = /<template[\s\S]+<\/template>/g;
const functionalRE = /<template functional>/;
const commentRE = /<!--+[\S\s]+?--+>/g;

module.exports = function autoImport(content) {
  const loaderContext = this;

  const { resourceQuery } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = getOptions(loaderContext);

  const trigger = '\n<import lang=js></import>\n';

  /*
   * IMPORTANT
   * loader options which has custom import gen(aka function)
   * can not be passed to child process.
   * because we will gen js code for auto-import, and cli-plugin-babel(vue)
   * use thread-loader in production by default(which use subprocess).
   * as above, setting LINE_DEV=true won't work right in production,
   * and always gen imports from line.esm.bundler
   */

  if (!rawQuery) {
    // trigger vue-loader custom block process
    return content + trigger;
  }
  if (incomingQuery.type && incomingQuery.blockType !== 'import') {
    return content;
  }

  // match template
  const matched = content.match(templateRE);

  // no template
  if (!matched) {
    return content + trigger;
  }

  // functional
  if (functionalRE.test(content)) {
    return content + trigger;
  }

  // remove comment
  const template = matched[0].replace(commentRE, '');

  // parse tags & dirs
  const parsed = parse(template, options);

  // gen code
  const code = codegen(parsed, options) || trigger;

  return content + code;
};
