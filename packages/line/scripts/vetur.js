const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const markdown = require('markdown-it');
const cheerio = require('cheerio');
const logger = require('./logger');

const {
  hyphenate,
  camelize,
  uncapitalize,
  capitalize,
  slice,
  stringifyJSON,
  matchWIP,
} = require('./utils');

const md = markdown();

const packageDir = path.resolve(__dirname, '../');
const resolve = (p) => path.resolve(packageDir, p);

const args = require('minimist')(process.argv.slice(2));

const isRelease = args.release;
const clearDist = args.clear || isRelease;
const distFolder = args.dist || args.d;

const prefix = 'line';
const distDir = resolve(distFolder || 'vetur');

run();

async function run() {
  logger.log();
  logger.log('vetur', 'GEN');

  if (clearDist) {
    await fs.remove(distDir);
  }

  const root = resolve('src/components');
  const files = glob
    .sync('*/[Rr]eadme.md', { cwd: root, absolute: true })
    .sort();

  const veturs = {
    tags: {},
    attributes: {},
  };

  for (const file of files) {
    if (matchWIP(file)) {
      logger.log(`${path.relative(root, file)} (skipped)`, 'WIP');
      continue;
    }

    const readme = await fs.readFile(file, 'utf-8');
    const parsed = parse(readme);
    const { tags, attributes } = vetur(parsed);

    tags.forEach((tag) => {
      const { key, attributes, description } = tag;
      veturs.tags[key] = { attributes, description };
    });
    attributes.forEach((attribute) => {
      const { key, type, description } = attribute;
      veturs.attributes[key] = { type, description };
    });
  }

  await fs.ensureDir(distDir);
  await fs.writeFile(
    `${distDir}/line-tags.json`,
    stringifyJSON(veturs.tags, null, 2)
  );
  await fs.writeFile(
    `${distDir}/line-attributes.json`,
    stringifyJSON(veturs.attributes, null, 2)
  );

  logger.log(`vetur/line-tags.json, vetur/line-attributes.json`, 'DONE');
}

const parse = (content) => {
  const $ = cheerio.load(md.render(content));
  const name = $('h1').text();
  const tag = nameToTag(name);
  const description = $('h1')
    .nextUntil('h2')
    .map((i, e) => $(e).text())
    .get()
    .join('\n');

  const parts = $('h2')
    .map((index, el) => {
      const name = $(el).text();
      const table = $(el).nextUntil('h2', 'table');
      const th = table
        .find('th')
        .map((index, el) => $(el).text())
        .get();
      const td = table
        .find('td')
        .map((index, el) => $(el).text())
        .get();

      const detail = slice(td, th.length).map((value, index) => {
        return th.reduce((meta, key, index) => {
          meta[key] = value[index] || '';
          return meta;
        }, {});
      });

      return {
        name,
        detail,
      };
    })
    .get();

  return {
    name,
    tag,
    description,
    parts,
  };
};

const vetur = (meta) => {
  const { tag, description, parts } = meta;
  const [props] = parts;
  const tags = [
    {
      key: tag,
      attributes: props ? props.detail.map((p) => p.property) : [],
      description,
    },
  ];
  const attributes = props
    ? props.detail.map((p) => ({
        key: `${tag}/${p.property}`,
        type: p.type,
        description: p.description,
      }))
    : [];

  return {
    tags,
    attributes,
  };
};

const nameToTag = (name) => {
  return `${hyphenate(
    `${camelize(uncapitalize(prefix))}${capitalize(name.replace(' ', ''))}`
  )}`;
};
