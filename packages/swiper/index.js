if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/swiper.cjs.prod.js');
} else {
  module.exports = require('./dist/swiper.cjs.js');
}
