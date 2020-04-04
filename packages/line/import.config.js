const inspect = require('./inspect');

const importgen = (parsed) => {
  const {
    components, // Array
    directives, // Array
  } = parsed;

  if (inspect.isDev) {
    return `
${components
  .map((name) => {
    if (!inspect.imports.has(name)) return '';
    return `import ${name} from '${inspect.imports.get(name)}';`;
  })
  .filter(Boolean)
  .join('\n')}
${directives
  .map((name) => {
    if (!inspect.imports.has(name)) return '';
    return `import ${name} from '${inspect.imports.get(name)}';`;
  })
  .filter(Boolean)
  .join('\n')}
    `.trim();
  }

  return `
import { ${[].concat(components, directives).join(', ')} } from '${
    inspect.name
  }';
  `.trim();
};

module.exports = {
  ...inspect,

  tag: true,
  dir: true,

  get components() {
    return inspect.components;
  },
  get directives() {
    return inspect.directives;
  },

  importgen,
};
