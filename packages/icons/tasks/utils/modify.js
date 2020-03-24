const File = require('vinyl');
const through2 = require('through2');

module.exports = (onData) => {
  return through2.obj(
    (file, enc, callback) => {
      callback(
        null,
        new File({
          path     : file.path,
          contents : Buffer.from(onData(file.contents) || file.contents),
        }),
      );
    },
  );
};
