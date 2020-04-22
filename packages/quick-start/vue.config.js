module.exports = {
  // disable eslint-loader in production env
  lintOnSave: process.env.NODE_ENV !== 'production',

  transpileDependencies: ['@line-ui/line', '@line-ui/kom'],
};
