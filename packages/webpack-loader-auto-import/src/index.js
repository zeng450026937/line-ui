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

  const { comp } = extract(content, this.query);

  if (!comp) {
    return content;
  }

  const code = `
<import lang="js">
import { ${ comp.join(',') } } from 'skyline';

export default function (component) {
  component.options.components = Object.assign(
    { 
      ${ comp.map(name => `Line${ name }: ${ name }`).join(',') }
    },
    component.options.components,
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

const compRegex = {
  '?kebab'    : /line-\w+/g,
  '?pascal'   : /Line[A-Z]\w+/g,
  '?combined' : /(line-\w+|Line[A-Z]\w+)/g,
};

function extract(content, query) {
  let comp = content.match(compRegex[query]);

  if (comp !== null) {
    // de-duplicates
    comp = Array.from(new Set(comp));

    if (query === '?kebab') {
      comp = comp.map(name => camelize(name.replace('line', '')));
    }
    if (query === '?pascal') {
      comp = comp.map(name => name.replace('Line', ''));
    }

    if (query === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // de-duplicates
      comp = Array.from(new Set(comp));
    }
  }

  return {
    comp,
  };
}
