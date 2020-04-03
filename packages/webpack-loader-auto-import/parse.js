const htmlTags = require('html-tags');
const { makeDirToName, makeTagToName } = require('./transform');

const gCached = {};

module.exports = (content, options) => {
  const {
    // package name
    name,
    // component prefix
    prefix = '',
    // check tag
    tag = true,
    // check directive
    dir = true,
    // supported components
    components = [],
    // supported directives
    directives = [],
  } = options;

  const hasComponents = !!components.length;
  const hasDirectives = !!directives.length;

  const shouldParseTag = hasComponents && tag;
  const shouldParseDir = hasDirectives && dir;

  const matched = {
    tags: new Set(),
    dirs: new Set(),
    components: new Set(),
    directives: new Set(),
  };

  const cached = gCached[name] || (gCached[name] = {});
  let { tagToName, dirToName } = cached;

  if (shouldParseTag) {
    if (!tagToName) {
      tagToName = cached.tagToName = makeTagToName(components, prefix);
    }

    const tags = (matched.tags = parseTag(content));

    tags.forEach((tag) => {
      const name = tagToName(tag);
      if (!name) return;
      matched.components.add(name);
    });
  }
  if (shouldParseDir) {
    if (!dirToName) {
      dirToName = cached.dirToName = makeDirToName(directives);
    }

    const tags = (matched.dirs = parseDir(content));

    tags.forEach((tag) => {
      const name = dirToName(tag);
      if (!name) return;
      matched.directives.add(name);
    });
  }

  return {
    tagToName,
    dirToName,
    tags: Array.from(matched.tags),
    dirs: Array.from(matched.dirs),
    components: Array.from(matched.components),
    directives: Array.from(matched.directives),
  };
};

const knownTags = ['template', 'script', 'style'];
const htmlTagSet = new Set(htmlTags);

// const tagRE = new RegExp(`(?<=<)(?!${ knownTags.join('|') })(?=line-app)[^/>\\s]+`, 'g');
const tagRE = new RegExp(`(?<=<)(?!${knownTags.join('|')})[^/>\\s]+`, 'g');
const parseTag = (content) => {
  const tags = content.match(tagRE) || [];
  return new Set(tags.filter((tag) => !htmlTagSet.has(tag)));
};

const dirRE = /(?<=\sv-)[^/>=\s]+/g;
const parseDir = (content) => {
  const tags = content.match(dirRE) || [];
  return new Set(tags);
};
