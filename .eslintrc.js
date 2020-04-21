module.exports = {
  root: true,

  extends: ['@line-ui'],

  globals: {
    __DEV__: 'readonly',
    __TEST__: 'readonly',
    __BROWSER__: 'readonly',
    __BUNDLER__: 'readonly',
    __ESM_BROWSER__: 'readonly',
    __ESM_BUNDLER__: 'readonly',
    __GLOBAL__: 'readonly',
    __NODE_JS__: 'readonly',
    __COMMIT__: 'readonly',
    __VERSION__: 'readonly',
    // webpack config plugin
    __CONFIG_RUNTIME__: 'readonly',
    $config: 'writable',
    // webpack i18n plugin
    __I18N_RUNTIME__: 'readonly',
    $tr: 'writable',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
