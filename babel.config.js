// use process.env to detect compile type(website or library)
// if we build for library, set useBuiltIns false to prevent unnecessary polyfills

module.exports = {
  presets : [
    '@vue/cli-plugin-babel/preset',
  ],
};
