module.exports = {
  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],

  parserOptions: {
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-inferrable-types': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-this-alias': 0,
        '@typescript-eslint/no-use-before-define': 0,
      },
    },
    {
      files: ['*.js', '*.vue'],
      rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
        // does not work with type definitions
        'no-unused-vars': 0,
        // js file is considered to be script file
        // and only run in node environment
        'global-require': 0,
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': 0,
        'import/order': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/no-this-alias': 0,
      },
    },
  ],

  rules: {
    radix: 0,

    'no-bitwise': 0,
    'no-await-in-loop': 0,
    'no-shadow': 0,
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
    'no-mixed-operators': 1,

    'consistent-return': 0,
    'prefer-destructuring': [
      'warn',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'func-names': 0,

    'class-methods-use-this': 1,
    'lines-between-class-members': 0,
    'max-classes-per-file': 0,

    'spaced-comment': [
      'warn',
      'always',
      {
        block: { exceptions: ['#__PURE__'] },
      },
    ],

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: true,
      },
    ],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['dist/', 'vue/types'],
      },
    ],
    'import/prefer-default-export': 0,
  },
};
