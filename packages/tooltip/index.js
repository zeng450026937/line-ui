'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/tooltip.cjs.prod.js')
} else {
  module.exports = require('./dist/tooltip.cjs.js')
}
