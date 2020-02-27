'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/babel-plugin-component.cjs.prod.js')
} else {
  module.exports = require('./dist/babel-plugin-component.cjs.js')
}
