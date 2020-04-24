const qs = require('querystring');
const { getOptions } = require('loader-utils');

module.exports = function tagLoader(content) {
  const loaderContext = this;

  const { resourceQuery } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = getOptions(loaderContext);

  const plugin = loaderContext['tag-plugin'];

  if (plugin) {
    switch (incomingQuery.blockType) {
      case 'head':
        plugin.setHead(rawQuery, content.trim());
        break;
      case 'body':
        plugin.setBody(rawQuery, content.trim());
        break;
      default:
        console.log('unknown tag');
        break;
    }
  }

  return '';
};
