if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/i18n-runtime.cjs.prod.js');
} else {
  module.exports = require('./dist/i18n-runtime.cjs.js');
}
