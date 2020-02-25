const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const fs = require('fs-extra');

const target = 'skyline';
const packagesDir = path.resolve(__dirname, '../packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET || target);
const name = path.basename(packageDir);
const resolve = p => path.resolve(packageDir, p);

async function generateScssFile(source, destination) {
  const src = resolve(source);
  const dest = resolve(destination);
  const pathList = resolve('src/style');

  console.log('src: ', src);
  console.log('dest: ', dest);
  const deps = await getScssFileDeps(src, pathList);
  console.log('deps: ', deps);
  const code = await getConcatenatedContent(deps);
  await fs.writeFile(dest, code);
  await validateScssFile(destination);
}

async function getScssFileDeps(src, pathList) {
  return new Promise((resolve, reject) => {
    /*
     * Cannot use result.stats.includedFiles
     * because it does not contain variable only files
     */
    const deps = [src];

    // We do 2 things here: validate and build import graph
    sass.render({
      file     : src,
      importer : [
        (url, prev, done) => {
          console.log('importer?');
          // needed for Windows as "prev"
          // comes with backward slashes
          prev = path.normalize(prev);

          const file = path.normalize(path.join(
            prev ? path.dirname(prev) : pathList,
            url,
          ));

          // avoid duplicates
          if (deps.indexOf(file) === -1) {
            // insert in the right order
            if (prev) {
              deps.splice(deps.indexOf(prev), 0, file);
            } else {
              deps.push(file);
            }
          }

          done({ file });
        },
      ],
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.stats.includedFiles);
    });
  });
}

async function getConcatenatedContent(src) {
  return new Promise((resolve, reject) => {
    let code = '';

    src.forEach((file) => {
      code += `${ fs.readFileSync(file) }\n`;
    });

    code = code
      // remove imports
      .replace(/@import\s+('|")[^('|")]+('|");([\s\r\n]?)+/g, '')
      // remove comments
      .replace(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')
      // remove unnecessary newlines
      .replace(/[\r\n]+/g, '\r\n');

    resolve(code);
  });
}

async function validateScssFile(src) {
  const file = resolve(src);

  return new Promise((resolve, reject) => {
    sass.render({ file }, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

generateScssFile('src/style/skyline.bundle.scss', 'dist/skyline.bundle.scss');
