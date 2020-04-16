const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const Replacer = require('./replacer');

const NS = 'i18n-compiler';

module.exports = function compile(compilation, entry, translations) {
  const { target, mode } = compilation.options;
  const outputOptions = {
    filename: 'js/[name].js',
    publicPath: compilation.outputOptions.publicPath,
  };
  const compiler = compilation.createChildCompiler('i18n', outputOptions);
  // The file path context which webpack uses to resolve all relative files to
  compiler.context = compilation.compiler.context;

  if (target === 'web') {
    new JsonpTemplatePlugin().apply(compiler);
  } else {
    // Compile the template to nodejs javascript
    new NodeTemplatePlugin(outputOptions).apply(compiler);
    new NodeTargetPlugin().apply(compiler);
  }

  new LibraryTemplatePlugin('tr', 'var').apply(compiler);
  new LoaderTargetPlugin(target).apply(compiler);
  new SingleEntryPlugin(compiler.context, entry, 'i18n').apply(compiler);

  const replacements = [
    {
      token: `'__placeholder__'`,
      replaceTo: `[${translations.map((translation) => `'${translation}'`)}]`,
    },
  ];

  compiler.hooks.thisCompilation.tap(NS, (compilation) => {
    compilation.hooks.beforeChunkAssets.tap(NS, () => {
      compilation.modules.forEach((m) => {
        Replacer.replaceInModuleSource(m, replacements, compilation);
      });
    });
  });

  return new Promise((resolve, reject) => {
    compiler.runAsChild((err, entries, childCompilation) => {
      // Reject the promise if the childCompilation contains error
      if (
        childCompilation &&
        childCompilation.errors &&
        childCompilation.errors.length
      ) {
        const errorDetails = childCompilation.errors
          .map(
            (error) => error.message + (error.error ? `:\n${error.error}` : '')
          )
          .join('\n');
        reject(new Error(`Child compilation failed:\n${errorDetails}`));
        return;
      }
      // Reject if the error object contains errors
      if (err) {
        reject(err);
        return;
      }

      const filename = compilation.mainTemplate.hooks.assetPath.call(
        outputOptions.filename,
        {
          hash: childCompilation.hash,
          chunk: entries[0],
        }
      );

      resolve({
        filename,
        hash: entries[0].hash,
        entry: entries[0],
      });
    });
  });
};
