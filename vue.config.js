const path = require('path');

module.exports = {
  // disable eslint-loader in production env
  lintOnSave: process.env.NODE_ENV !== 'production',

  chainWebpack: (config) => {
    const masterVersion = require(path.resolve('package.json')).version;

    config.plugin('define').tap((opts) => {
      opts[0].__DEV__ = process.env.NODE_ENV === 'development';
      opts[0].__VERSION__ = `"${masterVersion}"`;
      return opts;
    });
  },

  transpileDependencies: ['@line-ui/line'],
  /*
  chainWebpack : (config) => {
    // support markdown file
    const mdRule = config.module.rule('md').test(/\.md$/);
    const addLoader = ({ loader, options }) => {
      mdRule.use(loader).loader(loader).options(options);
    };
    addLoader({ loader: 'vue-loader' });
    addLoader({ loader: '@line-ui/markdown-loader' });
  },
  */
};
