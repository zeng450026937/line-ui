'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/directives.cjs.prod.js')
} else {
  module.exports = require('./dist/directives.cjs.js')
}
