module.exports = {
  root : true,

  extends : [
    '@line-ui',
  ],

  rules : {
    'no-console'  : 0, // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger' : process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
