module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-plusplus': 0,
    'no-nested-ternary': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-unused-expressions': 0,
    'no-underscore-dangle': 0,
    'no-multi-assign': 0,
    'no-iterator': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'no-unused-vars': 1,
    'arrow-body-style': 0,
    'prefer-arrow-callback': 0,
    'lines-between-class-members': 0,
    'class-methods-use-this': 1,
    'import/prefer-default-export': 0,
    "template-curly-spacing": ["warn", "always"]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
