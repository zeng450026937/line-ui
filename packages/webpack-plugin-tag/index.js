const qs = require('querystring');
const cheerio = require('cheerio');

const NS = 'tag-plugin';

class TagPlugin {
  constructor(options = {}) {
    this.options = options;
    this.headTags = new Map();
    this.bodyTags = new Map();
  }

  /* eslint-disable-next-line */
  apply(compiler) {
    compiler.hooks.compilation.tap(NS, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(NS, (loaderContext) => {
        loaderContext[NS] = this;
      });

      if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapPromise(
          NS,
          async (htmlPluginData) => {
            const $ = cheerio.load(htmlPluginData.html);
            this.headTags.forEach((tags) => {
              $(tags).insertAfter('head');
            });
            this.bodyTags.forEach((tags) => {
              $(tags).insertAfter('body');
            });
            htmlPluginData.html = $.html();
            return htmlPluginData;
          }
        );
      }
    });

    const rules = [
      {
        loader: require.resolve('./lib/tag-loader.js'),
        resourceQuery: (query) => {
          const parsed = qs.parse(query.slice(1));
          return /^(head|body)$/.test(parsed.blockType);
        },
      },
    ];
    const rawRules = compiler.options.module.rules;

    // replace original rules
    compiler.options.module.rules = [...rawRules, ...rules];
  }

  setHead(id, tags, type = 'post') {
    this.headTags.set(id, tags);
  }

  setBody(id, tags, type = 'post') {
    this.bodyTags.set(id, tags);
  }
}

module.exports = TagPlugin;
