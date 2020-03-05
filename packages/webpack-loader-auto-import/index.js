'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/webpack-loader-auto-import.cjs.prod.js')
} else {
  module.exports = require('./dist/webpack-loader-auto-import.cjs.js')
}
