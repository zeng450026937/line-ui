// Collect tr call from vue template
const qs = require('querystring');
const { getOptions } = require('loader-utils');

module.exports = function autoImport(content) {
  const loaderContext = this;

  const {
    resourceQuery,
  } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = getOptions(loaderContext);

  return content;
};
