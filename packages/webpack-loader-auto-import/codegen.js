module.exports = (parsed, options) => {
  const {
    // package name
    name,
    importgen: customImportGen,
    exportgen: customExportGen,
  } = options;
  const {
    components, // Array
    directives, // Array
  } = parsed;

  const hasComponents = !!components.length;
  const hasDirectives = !!directives.length;

  if (!hasComponents && !hasDirectives) {
    return '';
  }

  const importgen =
    customImportGen ||
    (() => {
      const imports = [].concat(components, directives);

      return `
  import { ${imports.join(',')} } from '${name}';
    `.trim();
    });

  const exportgen =
    customExportGen ||
    (() => {
      const componentPart = hasComponents
        ? `
  const components = {
    ${components
      .map((component) => `[${component}.name]: ${component},`)
      .join('\n    ')}
  };
  options.components = Object.assign(
    components,
    options.components,
  );  
      `.trim()
        : '';

      const directivePart = hasDirectives
        ? `
  const directives = {
    ${directives
      .map((directive) => `[${directive}.name]: ${directive},`)
      .join('\n    ')}
  };
  options.directives = Object.assign(
    directives,
    options.directives,
  );  
      `.trim()
        : '';

      return `
export default function (component) {
  const { options } = component;
  ${componentPart}
  ${directivePart}
}
    `.trim();
    });

  const code = `
<import lang="js">
${importgen(parsed, options)}

${exportgen(parsed, options)}
</import>
  `.trim();

  return code;
};
