const camelizeRE = /-(\w)/g;
// hyphenate => camel
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

// hyphenate => pascal
export const pascalize = (str: string): string => camelize(`-${str}`);

const hyphenateRE = /\B([A-Z])/g;
// camel => hyphenate
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

// camel => pascal
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
