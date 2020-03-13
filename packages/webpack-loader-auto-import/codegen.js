module.exports = (parsed, options) => {
  const {
    // package name
    name,
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

  const imports = [].concat(components, directives);

  const componentPart = hasComponents
    ? `
  const components = {
    ${ components.map(component => `[${ component }.name]: ${ component },`).join('\n    ') }
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
    ${ directives.map(directive => `[${ directive }.name]: ${ directive },`).join('\n    ') }
  };
  options.directives = Object.assign(
    directives,
    options.directives,
  );  
      `.trim()
    : '';

  const code = `
<import lang="js">
import { ${ imports.join(',') } } from '${ name }';

export default function (component) {
  const { options } = component;
  ${ componentPart }
  ${ directivePart }
}
</import>
  `.trim();

  return code;
};
