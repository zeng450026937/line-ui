const path = require('path');
const execa = require('execa');

const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7);

module.exports = {
  // disable eslint-loader in production env
  lintOnSave: process.env.NODE_ENV !== 'production',

  publicPath: process.env.PUBLIC_PATH || '/',

  chainWebpack: (config) => {
    const masterVersion = require(path.resolve('package.json')).version;

    config.plugin('define').tap((opts) => {
      opts[0].__DEV__ = process.env.NODE_ENV !== 'production';
      opts[0].__TEST__ = process.env.NODE_ENV === 'test';
      opts[0].__COMMIT__ = `"${commit}"`;
      opts[0].__VERSION__ = `"${masterVersion}"`;
      return opts;
    });
  },

  transpileDependencies: ['@line-ui/line', '@line-ui/kom'],
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
