'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/store.cjs.prod.js.js');
} else {
  module.exports = require('./dist/store.cjs.js.js');
}
