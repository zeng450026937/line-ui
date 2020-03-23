const { validate } = require('svg-mixer-utils');

const { name: packageName } = require('../package.json');
const schemas = require('../schemas');

const config = require('./config');
const SpriteCompiler = require('./utils/sprite-compiler');
const { configurator: configure, Replacer } = require('./utils');
const { isHtmlPluginCompilation } = require('./utils').helpers;

let INSTANCE_COUNTER = 0;

class ExtractSvgSpritePlugin {
  static get loader() {
    return config.LOADER_PATH;
  }

  static get cssLoader() {
    return config.CSS_LOADER_PATH;
  }

  constructor(cfg) {
    this.id = ++INSTANCE_COUNTER;
    this.config = configure(cfg);

    const errors = validate(schemas.plugin, this.config);

    if (errors.length) {
      throw new Error(`${ packageName }: ${ errors.join('\n') }`);
    }

    this.compiler = new SpriteCompiler(this.config);
  }

  // eslint-disable-next-line class-methods-use-this
  get NAMESPACE() {
    return config.NAMESPACE;
  }

  apply(compiler) {
    const { NAMESPACE } = config;

    if (compiler.hooks) {
      compiler.hooks
        .thisCompilation
        .tap(NAMESPACE, compilation => {
          // compile sprite
          compilation.hooks
            .optimizeTree
            .tapPromise(NAMESPACE, () => this.hookOptimizeTree(compilation));

          // replace css placeholder
          // compilation.hooks
          //   .afterOptimizeTree
          //   .tap(NAMESPACE, () => this.hookAfterOptimizeTree(compilation));

          // replace (chunk) placeholder
          compilation.hooks
            .beforeChunkAssets
            .tap(NAMESPACE, () => this.hookBeforeChunkAssets(compilation));

          // add sprite asset
          compilation.hooks
            .additionalAssets
            .tapPromise(NAMESPACE, () => this.hookAdditionalAssets(compilation));
        });

      compiler.hooks
        .compilation
        .tap(NAMESPACE, compilation => {
          compilation.hooks
            .normalModuleLoader
            .tap(NAMESPACE, loaderCtx => this.hookNormalModuleLoader(loaderCtx));

          if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
            compilation.hooks
              .htmlWebpackPluginBeforeHtmlGeneration
              .tapAsync(NAMESPACE, async (htmlPluginData, done) => {
                const result = await this.compileSprites(compilation);
                this.hookBeforeHtmlGeneration(htmlPluginData, result);
                done(null, htmlPluginData);
              });
          }
        });
    } else {
      compiler.plugin('compilation', compilation => {
        if (isHtmlPluginCompilation(compilation)) {
          return;
        }

        compilation.plugin(
          'normal-module-loader',
          loaderCtx => this.hookNormalModuleLoader(loaderCtx),
        );

        compilation.plugin('additional-assets', done => this.compileSprites(compilation).then(result => {
          this.hookAdditionalAssets(compilation, result);
          done();
        }));

        compilation.plugin(
          'html-webpack-plugin-before-html-generation',
          (htmlPluginData, done) => this.compileSprites(compilation).then(result => {
            this.hookBeforeHtmlGeneration(htmlPluginData, result);
            done(null, htmlPluginData);
          }),
        );
      });
    }
  }

  // TODO refactor this ugly way to avoid double compilation when using extract-text-webpack-plugin
  async compileSprites(compilation) {
    if (!this.prevResult) {
      this.prevResult = await this.compiler.compile(compilation);
    }
    return this.prevResult;
  }

  hookNormalModuleLoader(loaderContext) {
    loaderContext[config.NAMESPACE] = this;
  }

  hookOptimizeTree(compilation) {
    return this.compileSprites(compilation);
  }

  hookAfterOptimizeTree(compilation) {
    const symbols = this.compiler.getSymbols();

    symbols.forEach(s => {
      if (!s.replacements) return;
      s.cssModules.forEach(m => {
        Replacer.replaceInModuleSource(m, s.replacements, compilation);
      });
    });
  }

  hookBeforeChunkAssets(compilation) {
    const symbols = this.compiler.getSymbols();

    symbols.forEach(s => {
      if (!s.replacements) return;

      s.cssModules.forEach(m => {
        Replacer.replaceInModuleSource(m, s.replacements, compilation);
      });

      Replacer.replaceInModuleSource(s.module, s.replacements, compilation);
      // Replacer.replaceInModuleSource(s.module.issuer, s.replacements, compilation);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async hookAdditionalAssets(compilation) {
    const result = await this.compileSprites(compilation);

    result.forEach(({ filename, content }) => {
      if (filename) {
        compilation.assets[filename.split('?')[0]] = {
          source : () => content,
          size   : () => content.length,
        };
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  hookBeforeHtmlGeneration(htmlPluginData, result) {
    htmlPluginData.assets.sprites = result
      .map(({ filename, content }) => ({ filename, content }));
  }
}

module.exports = ExtractSvgSpritePlugin;
