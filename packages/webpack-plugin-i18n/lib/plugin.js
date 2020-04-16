const I18nParser = require('./i18n-parser');
const compile = require('./compile');
const path = require('path');

const NS = 'i18n-plugin';

class I18nPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  /* eslint-disable-next-line */
  apply(compiler) {
    const parser = new I18nParser();
    parser.apply(compiler);

    const dirty = false;
    let hints;

    compiler.hooks.make.tap(NS, (compilation) => {
      compilation.hooks.finishModules.tapPromise(NS, async () => {
        if (dirty) {
          const result = await compile(
            compilation,
            path.resolve(__dirname, '../runtime/index.js'),
            []
          );
          hints = {
            head: [
              {
                tagName: 'link',
                attributes: {
                  href: result.filename,
                  rel: 'preload',
                  as: 'script',
                },
              },
            ],
            body: [
              {
                tagName: 'script',
                closeTag: true,
                attributes: {
                  type: 'text/javascript',
                  src: result.filename,
                },
              },
            ],
          };
        }
      });

      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(
        NS,
        async (html) => {
          if (!hints) return;
          html.head = [...hints.head, ...html.head];
          html.body = [...hints.body, ...html.body];
        }
      );
    });
  }
}

module.exports = I18nPlugin;
