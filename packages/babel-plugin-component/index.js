const {
  addSideEffect,
} = require('@babel/helper-module-imports');

const NOOP = () => {};

module.exports = function componentStyle() {
  return {
    visitor : {
      ImportDeclaration(path, state) {
        // https://github.com/babel/babel/tree/master/packages/babel-types#timportdeclarationspecifiers-source

        // path.node has properties 'source' and 'specifiers' attached. path.node.source is the library/module
        // name, aka 'react-bootstrap'. path.node.specifiers is an array of ImportSpecifier |
        // ImportDefaultSpecifier | ImportNamespaceSpecifier

        const source = path.node.source.value;
        const options = state.opts[source];

        if (options) {
          let effects = [];

          const {
            effect = NOOP,
            fullImportEffect = NOOP,
            memberImportEffect = NOOP,
            preventFullImport,
          } = options;

          path.node.specifiers.forEach(specifier => {
            const isFullImport = specifier.type !== 'ImportSpecifier';
            const isMemberImport = specifier.type === 'ImportSpecifier';
            const importName = specifier.local.name;

            if (isFullImport && preventFullImport) {
              throw new Error(`Import of entire module ${ source } not allowed due to preventFullImport setting`);
            }

            if (isFullImport) {
              effects = effects.concat(fullImportEffect(importName));
            }
            if (isMemberImport) {
              effects = effects.concat(memberImportEffect(importName));
            }

            effects = effects.concat(effect(importName, isFullImport /* full import */));
          });

          effects.forEach(effect => effect && addSideEffect(path, effect));
        }
      },
    },
  };
};
