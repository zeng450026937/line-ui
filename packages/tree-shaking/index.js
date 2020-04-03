if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/tree-shaking.cjs.prod.js');
} else {
  module.exports = require('./dist/tree-shaking.cjs.js');
}
