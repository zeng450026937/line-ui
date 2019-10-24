module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-trailing-spaces': 0,
    'prefer-arrow-callback': 0,
    'no-unused-vars': 1,
    'no-plusplus': 0,
    'no-multi-assign': 1,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-multi-assign': 0,
    'no-continue': 0,
    'no-nested-ternary': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
