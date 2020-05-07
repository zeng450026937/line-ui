const qs = require('querystring');
const matter = require('gray-matter');
const { getOptions } = require('loader-utils');
const md = require('./markdown');
const component = require('./component');

module.exports = function MarkdownLoader(content) {
  const loaderContext = this;

  const { resourceQuery, resource } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = getOptions(loaderContext);

  const { data: meta, content: body } = matter(content);
  const rendered = md.render(body);

  return `export default ${JSON.stringify(rendered)}`;
};
