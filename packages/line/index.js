'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/line.cjs.prod.js')
} else {
  module.exports = require('./dist/line.cjs.js')
}
