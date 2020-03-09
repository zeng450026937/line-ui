const { addSideEffect } = require('@babel/helper-module-imports');

module.exports = () => {
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
            effect,
            fullImportEffect,
            memberImportEffect,
            fullImport = true,
            memberImport = true,
          } = options;

          path.node.specifiers.forEach(specifier => {
            // Examples of "full" imports:
            //   import * as name from 'module'; (ImportNamespaceSpecifier)
            //   import name from 'module'; (ImportDefaultSpecifier)
            const isFullImport = specifier.type !== 'ImportSpecifier';
            // Examples of member imports:
            //   import { member } from 'module'; (ImportSpecifier)
            //   import { member as alias } from 'module' (ImportSpecifier)
            const isMemberImport = specifier.type === 'ImportSpecifier';
            const importName = specifier.local.name;

            if (isFullImport && !fullImport) {
              throw new Error(`Import of entire module ${ source } not allowed due to fullImport setting`);
            }
            if (isMemberImport && !memberImport) {
              throw new Error(`Member Import of module ${ source } not allowed due to memberImport setting`);
            }

            if (isFullImport && fullImportEffect) {
              effects = effects.concat(fullImportEffect(importName));
            }
            if (isMemberImport && memberImportEffect) {
              effects = effects.concat(memberImportEffect(importName));
            }

            if (effect) {
              effects = effects.concat(effect(importName, isFullImport /* full import */));
            }
          });

          effects.forEach(effect => effect && addSideEffect(path, effect));
        }
      },
    },
  };
};
