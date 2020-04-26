const qs = require('querystring');
const { getOptions } = require('loader-utils');

module.exports = function tagLoader(content) {
  const loaderContext = this;

  const { resourceQuery, _module } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = getOptions(loaderContext);

  const plugin = loaderContext['tag-plugin'];

  if (plugin) {
    const tag = {
      before: incomingQuery.before,
      after: incomingQuery.after,
      content: content.trim(),
    };
    if (tag.before && tag.after) {
      console.warn(`can not set 'before' along with 'after'`);
    }
    switch (incomingQuery.blockType) {
      case 'tag':
        tag.after = tag.after || 'head';
        plugin.report(_module, tag);
        break;
      case 'head':
      case 'body':
        tag.after = tag.after || incomingQuery.blockType;
        plugin.report(_module, tag);
        break;
      default:
        console.warn('unknown tag');
        break;
    }
  }

  return '';
};
