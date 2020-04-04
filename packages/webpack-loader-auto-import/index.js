const qs = require('querystring');
const { getOptions } = require('loader-utils');
const parse = require('./parse');
const codegen = require('./codegen');

const templateRE = /<template[\s\S]+<\/template>/g;
const commentRE = /<!--+[\S\s]+?--+>/g;

module.exports = function autoImport(content) {
  const loaderContext = this;

  const { resourceQuery } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = getOptions(loaderContext);

  const trigger = '\n<import lang=js></import>\n';

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
  if (/<template functional>/.test(content)) {
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
