'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/icons.cjs.prod.js.js')
} else {
  module.exports = require('./dist/icons.cjs.js.js')
}
