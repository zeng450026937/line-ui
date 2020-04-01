/* eslint-disable func-names */
const path = require('path');
const merge = require('merge-options');
const through2 = require('through2');
const File = require('vinyl');
const { Compiler, Sprite } = require('svg-mixer');
const postcss = require('postcss');
const postcssSprite = require('postcss-svg-mixer');
const postcssAspectRatio = require('postcss-aspect-ratio-from-bg-image');
const postcssPrettify = require('postcss-prettify');

const basename = p => path.basename(p, path.extname(p));

/**
 * @param {SpriteSymbol[]} symbols
 * @param {string} selector
 * @return {string}
 */
function generateCss(symbols, selector) {
  return symbols
    .map(({ id, image }) => {
      const symbolSelector = selector.replace(/\[symbol-id\]/, id);
      return `${ symbolSelector } {background: url('${ image.path }${ image.query }')}`;
    })
    .join('');
}

const defaultConfig = {
  prettify : true,
  sprite   : {
    ...Sprite.defaultConfig,
    type : Sprite.TYPE,
  },
  css : {
    filename    : 'sprite-styles.css',
    selector    : '.[symbol-id]',
    aspectRatio : true,
  },
  manifest : true,
};

module.exports = config => {
  const cwd = process.cwd();
  const cfg = merge(defaultConfig, config);
  const {
    prettify,
    sprite: spriteConfig,
    css: cssConfig,
    manifest,
  } = cfg;

  const compiler = Compiler.create({
    prettify,
    spriteType : spriteConfig.type,
    spriteConfig,
  });

  return through2.obj((file, enc, callback) => {
    compiler.addSymbol(
      compiler.createSymbol({ path: file.path, content: file.contents }),
    );
    callback();
  }, async /** @this Stream */ function (callback) {
    const res = await compiler.compile();
    const spritePath = path.resolve(cwd, res.filename);

    this.push(new File({
      path     : spritePath,
      base     : path.dirname(spritePath),
      contents : Buffer.from(res.content),
    }));

    if (spriteConfig.usages && cssConfig) {
      const cssPath = path.resolve(cwd, cssConfig.filename);

      const processor = postcss([
        cssConfig.aspectRatio && postcssAspectRatio(),
        postcssSprite({ userSprite: res.sprite }),
        prettify && postcssPrettify(),
      ].filter(Boolean));

      const cssResult = await processor.process(
        generateCss(res.sprite.symbols, cssConfig.selector),
        { from: cssPath },
      );

      this.push(new File({
        path     : cssPath,
        base     : path.dirname(cssPath),
        contents : Buffer.from(cssResult.css),
      }));
    }

    if (manifest) {
      const manifest = {
        name    : basename(spritePath),
        symbols : res.sprite.symbols.map(s => ({
          id : s.id, width : s.width, height : s.height,
        })),
      };

      this.push(new File({
        path     : `${ basename(spritePath) }.json`,
        base     : path.dirname(spritePath),
        contents : Buffer.from(JSON.stringify(manifest, null, 2)),
      }));
    }

    callback();
  });
};
