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
  import { ${imports.join(', ')} } from '${name}';
    `.trim();
    });

  const exportgen =
    customExportGen ||
    (() => {
      const componentPart = hasComponents
        ? `
  const components = options.components = Object.create(options.components || {});
  ${components
    .map((component) => `components[${component}.name] = ${component};`)
    .join('\n  ')}
          `.trim()
        : '';

      const directivePart = hasDirectives
        ? `
  const directives = options.directives = Object.create(options.directives || {});
  ${directives
    .map((directive) => `directives[${directive}.name] = ${directive};`)
    .join('\n  ')}
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
