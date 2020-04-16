const webpackVersion = parseInt(require('webpack/package.json').version, 10);
const { ReplaceSource, RawSource } = require('webpack-sources');

module.exports = class Replacer {
  static getModuleChunk(module) {
    const chunks = Array.from(module.chunksIterable);

    if (Array.isArray(chunks) && chunks.length > 0) {
      return chunks[chunks.length - 1];
    }
    if (module.issuer) {
      return Replacer.getModuleChunk(module.issuer);
    }

    return null;
  }

  static getModuleReplaceSource(module, compilation) {
    const args = [compilation.dependencyTemplates];

    // eslint-disable-next-line no-magic-numbers
    if (webpackVersion <= 3) {
      args.push(compilation.outputOptions);
      args.push(compilation.requestShortener);
      // eslint-disable-next-line no-magic-numbers
    } else if (webpackVersion >= 4) {
      args.push(compilation.runtimeTemplate);
    }

    const cachedSource = module.source(...args);

    return typeof cachedSource.replace === 'function'
      ? cachedSource
      : cachedSource._source;
  }

  static replaceInModuleSource(module, replacements, compilation) {
    const source = Replacer.getModuleReplaceSource(module, compilation);

    replacements.forEach(({ token, replaceTo, start, end }) => {
      if (!token) return;

      const alreadyHasReplacement = source.replacements.find(
        (r) => r.start === start && r.end === end && r.content === replaceTo
      );

      if (alreadyHasReplacement) {
        return;
      }

      source.replace(start, end, replaceTo);
    });

    return module;
  }
};
