'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/ie-compat.cjs.prod.js')
} else {
  module.exports = require('./dist/ie-compat.cjs.js')
}
