const markdown = require('markdown-it');
const anchor = require('markdown-it-anchor');
const highlight = require('./highlight');

function slugify(val) {
  return encodeURIComponent(String(val).trim().replace(/\s+/g, '-'));
}

const options = {
  html: true,
  linkify: false,
  typographer: true,
  highlight,
};

const md = markdown(options).use(anchor, { level: 1, slugify });

module.exports = md;
