const qs = require('querystring');

module.exports = function autoImport(content) {
  const loaderContext = this;

  const {
    resourceQuery,
  } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);

  if (/<template functional>/.test(content)) {
    return content;
  }
  if (incomingQuery.type && incomingQuery.blockType !== 'import') {
    return content;
  }

  const { components } = extract(content, this.query);

  if (!components) {
    return content;
  }

  const code = `
<import lang="js">
import { ${ components.join(',') } } from 'skyline';

export default function (component) {
  const { options } = component;
  const components = { 
    ${ components.map(component => `[${ component.name }]: ${ component }`).join(',\n') }
  },
  options.components = Object.assign(
    components,
    options.components,
  );
}
</import>
`;

  return content + code;
};

const camelizeRE = /-(\w)/g;
// hyphenate => camel
const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

// TODO
// make prefix configurable
const compRegex = {
  '?kebab'    : /line-\w+/g,
  '?pascal'   : /Line[A-Z]\w+/g,
  '?combined' : /(line-\w+|Line[A-Z]\w+)/g,
};

function extract(content, query) {
  let components = content.match(compRegex[query]);

  if (components !== null) {
    // de-duplicates
    components = Array.from(new Set(components));

    if (query === '?kebab') {
      components = components.map(name => camelize(name.replace('line', '')));
    }
    if (query === '?pascal') {
      components = components.map(name => name.replace('Line', ''));
    }

    if (query === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // de-duplicates
      components = Array.from(new Set(components));
    }
  }

  return {
    components,
  };
}
