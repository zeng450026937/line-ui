
module.exports = (api, options) => {
  api.chainWebpack(config => {
    // config.entry('app')
    //   .clear()
    //   .add(api.resolve('src/app.ts'));

    // for development, set "skyline" alias to source code
    // config.resolve.alias
    //   .set('skyline', api.resolve('packages/skyline/src'));
  });
};
