const {
  dest,
  src,
  series,
} = require('gulp');
const rename = require('gulp-rename');
const slugify = require('url-slug');
const svgo = require('gulp-svgo');
const mixer = require('./svg-mixer');
const clean = require('./clean');
const modify = require('./modify');
const manifest = require('./manifest');

const path = require('path');

const packageDir = path.resolve(__dirname, '../../');
const resolve = p => path.resolve(packageDir, p);

module.exports = (config) => {
  const {
    pkg,
    files,
    onName = (file) => { file.basename = slugify(file.basename); },
    onData = () => {},
  } = config;

  const build = () => {
    return src(files)
      .pipe(
        rename(onName),
      )
      .pipe(
        dest(resolve(`packages/${ pkg }`)),
      )
      .pipe(
        modify(onData),
      )
      .pipe(
        svgo({
          plugins : [
            { removeXMLNS: true },
            { cleanupListOfValues: true },
            { removeViewBox: false },
            { removeDimensions: true },
            { removeStyleElement: true },
            { removeScriptElement: true },
            { mergePaths: false }, // ionic icons has multiple path
            { removeAttrs: { attrs: '(data-.*)' } },
          ],
          multipass : true,
        }),
      )
      // .pipe(
      //   modify(onData),
      // )
      .pipe(
        mixer({
          sprite : { filename: `${ pkg }.svg`, usages: false },
          css    : { filename: `${ pkg }.css` },
        }),
      )
      .pipe(
        dest(resolve('dist')),
      );
  };

  return series(
    clean([
      resolve(`dist/${ pkg }.svg`),
      resolve(`dist/${ pkg }.css`),
      resolve(`dist/${ pkg }.json`),
      resolve(`packages/${ pkg }`),
    ]),

    build,
  );
};
