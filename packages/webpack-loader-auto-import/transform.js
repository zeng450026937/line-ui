exports.makeTagToName = (components, prefix) => {
  const kebabTagToName = new Map();
  const pascalTagToName = new Map();

  const nameWithPrefix = (name) => {
    return prefix ? `${prefix}-${name}` : name;
  };

  const nameToKebabTag = (name) => {
    return hyphenate(nameWithPrefix(name));
  };
  const nameToPascalTag = (name) => {
    return pascalize(nameWithPrefix(name));
  };

  components.forEach((name) => {
    kebabTagToName.set(nameToKebabTag(name), name);
    pascalTagToName.set(nameToPascalTag(name), name);
  });

  return (tag) => {
    return kebabTagToName.get(tag) || pascalTagToName.get(tag);
  };
};

exports.makeDirToName = (directives) => {
  const dirTagToName = new Map();

  const nameToDirTag = (name) => {
    return hyphenate(camelize(name));
  };

  directives.forEach((name) => {
    dirTagToName.set(nameToDirTag(name), name);
  });

  return (tag) => {
    return dirTagToName.get(tag);
  };
};

const camelizeRE = /-(\w)/g;
// hyphenate => camel
const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

const hyphenateRE = /\B([A-Z])/g;
// camel => hyphenate
const hyphenate = (str) => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

const pascalize = (str) => {
  return camelize(`-${str}`);
};

const uncapitalize = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
