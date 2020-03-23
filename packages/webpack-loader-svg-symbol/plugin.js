const loaderUtils = require('loader-utils');
const Chunk = require('webpack/lib/Chunk');
const createSvgSymbol = require('./svg-symbol');

const id = 'svg-loader-plugin';
const NS = 'svg-loader';

class SVGLoaderPlugin {
  constructor(options) {
    this.options = {
      // The `filename` defines the name of the emitted asset
      filename : 'svg-symbols.svg',
      // By default inject sprite into head
      inject   : true,
      inline   : true,
      ...options,
    };

    this.collection = new Map();
  }

  apply(compiler) {
    // add NS marker so that the loader can detect and report missing plugin
    if (compiler.hooks) {
      // webpack 4
      compiler.hooks.compilation.tap(id, compilation => {
        const { normalModuleLoader } = compilation.hooks;
        normalModuleLoader.tap(id, loaderContext => {
          loaderContext[NS] = this.collection;
        });
      });
    } else {
      // webpack < 4
      compiler.plugin('compilation', compilation => {
        compilation.plugin('normal-module-loader', loaderContext => {
          loaderContext[NS] = this.collection;
        });
      });
    }

    const {
      filename,
      inject,
      inline,
    } = this.options;

    let resourcePath;

    // 🤔 The `compilation` hook is called twice and ends up producing an empty svg
    // sprite. The `thisCompiliation` hook is only called once. This seems to be the
    // correct hook to use ¯\_(ツ)_/¯
    compiler.hooks.thisCompilation.tap(id, compilation => {
      compilation.hooks.additionalAssets.tapAsync(id, callback => {
        // Get sprite content returns full svg symbol sprite ready for application
        this.svgSymbol = createSvgSymbol(inline);
        this.collection.forEach((value, key) => {
          this.svgSymbol.add(value, key);
        });
        const content = this.content = this.svgSymbol.toString();

        // Use interpolateName to allow for file name hashing based on content
        resourcePath = loaderUtils.interpolateName(
          {},
          // CREATE A FILE NAME WITH HELLAS REGEX:
          // 1. Normalize to [hash]
          // 2. Inject default digest hash length if not there
          // loader-utils only supports [hash] interpolation, but that is confusing
          // because most other webpack filenames use either chunkhash or more
          // accurately in this case contenthash
          filename.replace(/contenthash|chunkhash/, 'hash').replace(
            // ℹ️ This will only match if a digest length hasn't been set
            /\[hash\]/,
            // see https://webpack.js.org/configuration/output/#output-hashdigestlength
            `[hash:${ compilation.outputOptions.hashDigestLength }]`,
          ),
          { content },
        );


        // 🤔 adding a chunk is required to get the emitted sprite included in the
        // manifest file. There may be a better way to handle this...
        const svgChunk = new Chunk('svg-symbols');
        svgChunk.ids = [];
        svgChunk.files.push(resourcePath);
        compilation.chunks.push(svgChunk);

        // The asset file is included in the webpack compilation 🎉
        compilation.assets[resourcePath] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          },
        };

        callback();
      });
    });

    if (inject) {
      // The alter asset tags hook is only called once during the compilation ¯\_(ツ)_/¯
      compiler.hooks.compilation.tap(id, compilation => {
        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(id, data => {
          data.assets.sprites = `${
            compilation.outputOptions.publicPath || ''
          }${ resourcePath }`;
        });
        // HTML webpack plugin hook to alter the asset tags included in generated HTML
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(id, data => {
          // data.body.unshift({
          //   tagName    : 'svg',
          //   closeTag   : true,
          //   attributes : this.svgSymbol.$svg[0].attribs,
          //   innerHTML  : this.svgSymbol.$svg.html(),
          // });
          // data.head.push({
          //   tagName    : 'script',
          //   closeTag   : true,
          //   attributes : { type: 'text/javascript' },
          //   innerHTML  : `window.ICON_SPRITE_ID = "${ compilation.outputOptions
          //     .publicPath || '' }${ resourcePath }";`,
          // });
        });
      });
    }
  }
}

SVGLoaderPlugin.NS = NS;
module.exports = SVGLoaderPlugin;
