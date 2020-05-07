const prism = require('prismjs');
const load = require('prismjs/components/index');

load(['markup', 'bash', 'javascript', 'scss', 'css', 'json']);

module.exports = (content, lang) => {
  if (lang === '') {
    lang = 'js';
  } else if (lang === 'vue' || lang === 'html') {
    lang = 'html';
  }

  if (prism.languages[lang]) {
    const code = prism.highlight(content, prism.languages[lang], lang);
    return code;
  }

  return '';
};
