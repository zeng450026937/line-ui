const ts = require('typescript');
const path = require('path');

module.exports = (options) => {
  return (context) => {
    const visitor = (node) => {
      if (ts.isSourceFile(node)) {
        return ts.visitEachChild(node, visitor, context);
      }

      if (!ts.isImportDeclaration(node)) {
        return node;
      }

      const importedLibName = node.moduleSpecifier.text;

      console.log('\nts-loader:', importedLibName);

      // const options = '';

      // if (!options) {
      //   return node;
      // }

      const structs = getImportedStructs(node);

      if (structs.size === 0) {
        return node;
      }
      console.log('\nts-loader structs:', structs);

      return node;
    };

    return (node) => ts.visitNode(node, visitor);
  };
};

function getImportedStructs(node) {
  const structs = new Set();
  node.forEachChild((importChild) => {
    if (!ts.isImportClause(importChild)) {
      return;
    }

    // not allow default import, or mixed default and named import
    // e.g. import foo from 'bar'
    // e.g. import foo, { bar as baz } from 'x'
    // and must namedBindings exist
    if (importChild.name || !importChild.namedBindings) {
      return;
    }

    // not allow namespace import
    // e.g. import * as _ from 'lodash'
    if (!ts.isNamedImports(importChild.namedBindings)) {
      return;
    }

    importChild.namedBindings.forEachChild((namedBinding) => {
      // ts.NamedImports.elements will always be ts.ImportSpecifier
      const importSpecifier = namedBinding;

      // import { foo } from 'bar'
      if (!importSpecifier.propertyName) {
        structs.add({ importName: importSpecifier.name.text });
        return;
      }

      // import { foo as bar } from 'baz'
      structs.add({
        importName: importSpecifier.propertyName.text,
        variableName: importSpecifier.name.text,
      });
    });
  });
  return structs;
}
