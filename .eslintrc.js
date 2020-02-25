module.exports = {
  root : true,

  extends : [
    '@skyline',
  ],

  rules : {
    'no-console'  : 0, // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger' : process.env.NODE_ENV === 'production' ? 'error' : 'off',

    '@typescript-eslint/no-empty-function'    : 1,
    '@typescript-eslint/no-inferrable-types'  : 1,
    '@typescript-eslint/no-this-alias'        : 1,
    '@typescript-eslint/no-explicit-any'      : 0,
    '@typescript-eslint/no-use-before-define' : 1,
  },
};
