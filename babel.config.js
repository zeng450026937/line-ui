module.exports = {
  presets : [
    '@vue/cli-plugin-babel/preset',
    process.env.NODE_ENV === 'development'
      ? '@skyline/babel-preset-skyline'
      : '',
  ].filter(Boolean),
};
