const isDev = process.env.NODE_ENV !== 'production';

module.exports = {

  publicPath : isDev
    ? '/'
    : '/server/client/web_app/skyline/',

  chainWebpack : (config) => {
    // support markdown file
    const mdRule = config.module.rule('md').test(/\.md$/);
    const addLoader = ({ loader, options }) => {
      mdRule.use(loader).loader(loader).options(options);
    };
    addLoader({ loader: 'vue-loader' });
    addLoader({ loader: '@skyline/markdown-loader' });
  },

};
