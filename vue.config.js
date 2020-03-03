const path = require('path');

module.exports = {

  // disable eslint-loader in production env
  lintOnSave : process.env.NODE_ENV !== 'production',

  chainWebpack : (config) => {
    const masterVersion = require(path.resolve('package.json')).version;

    config.plugin('define')
      .tap((opts) => {
        opts[0].__DEV__ = process.env.NODE_ENV === 'development';
        opts[0].__VERSION__ = `"${ masterVersion }"`;
        return opts;
      });
  },

  transpileDependencies : [
    'skyline',
  ],
  /*
  chainWebpack : (config) => {
    // support markdown file
    const mdRule = config.module.rule('md').test(/\.md$/);
    const addLoader = ({ loader, options }) => {
      mdRule.use(loader).loader(loader).options(options);
    };
    addLoader({ loader: 'vue-loader' });
    addLoader({ loader: '@skyline/markdown-loader' });
  },
  */

  pages : {
    index  : './packages/playground/app.ts',
    mobile : {
      entry    : './packages/playground/src/device/index.ts',
      template : 'public/index.html',
      title    : 'Mobile',
      filename : 'mobile.html',
    },
  },
};
