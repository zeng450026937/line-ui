const File = require('vinyl');
const through2 = require('through2');
const cheerio = require('cheerio');
const path = require('path');

const basename = (p) => path.basename(p, path.extname(p));

/* eslint-disable prefer-arrow-callback */

module.exports = () => {
  return through2.obj((file, enc, callback) => {
    const $ = cheerio.load(file.contents);
    const symbols = $('symbol');
    const manifest = {
      name: basename(file.path),
      symbols: symbols
        .map(function (i, el) {
          const id = $(el).attr('id');
          const viewBox = $(el).attr('viewBox');
          const width = $(el).attr('width') || viewBox.split(' ')[2];
          const height = $(el).attr('height') || viewBox.split(' ')[3];
          return {
            id,
            width,
            height,
            viewBox,
          };
        })
        .get(),
    };
    callback(
      null,
      new File({
        path: `${basename(file.path)}.json`,
        contents: Buffer.from(JSON.stringify(manifest)),
      })
    );
  });
};
