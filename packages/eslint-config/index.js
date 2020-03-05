module.exports = {
  env : {
    node : true,
  },

  globals : {
    window    : false,
    document  : false,
    navigator : false,
  },

  extends : [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],

  parserOptions : {
    ecmaVersion : 2020,
  },

  overrides : [
    {
      files : [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env : {
        jest : true,
      },
    },
    {
      files : ['*.ts'],
      rules : {
        '@typescript-eslint/no-explicit-any'      : 0,
        '@typescript-eslint/no-inferrable-types'  : 0,
        '@typescript-eslint/no-empty-function'    : 1,
        '@typescript-eslint/no-this-alias'        : 1,
        '@typescript-eslint/no-use-before-define' : 1,
      },
    },
    {
      files : ['*.js'],
      rules : {
        // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
        // does not work with type definitions
        'no-unused-vars'                          : 0,
        // js file is considered to be script file
        // and only run in node environment
        'global-require'                          : 0,
        'import/no-dynamic-require'               : 0,
        'import/order'                            : 0,
        '@typescript-eslint/no-var-requires'      : 0,
        '@typescript-eslint/no-use-before-define' : 0,
        '@typescript-eslint/no-this-alias'        : 0,
        '@typescript-eslint/no-empty-function'    : 0,
      },
    },
  ],

  rules : {
    'no-await-in-loop'      : 0,
    'no-shadow'             : 0,
    'no-plusplus'           : 0,
    'no-nested-ternary'     : 0,
    'no-return-assign'      : 0,
    'no-param-reassign'     : 0,
    'no-unused-expressions' : 0,
    'no-underscore-dangle'  : 0,
    'no-multi-assign'       : 0,
    'no-iterator'           : 0,
    'no-restricted-syntax'  : 0,
    'no-continue'           : 0,
    'no-mixed-operators'    : 1,
    'consistent-return'     : 1,
    'max-len'               : [2, 120,
      {
        tabWidth               : 2,
        comments               : 110,
        ignoreUrls             : true,
        ignoreStrings          : true,
        ignoreTemplateLiterals : true,
        ignoreRegExpLiterals   : true,
      },
    ],
    'key-spacing' : [2,
      {
        singleLine : {
          beforeColon : false,
          afterColon  : true,
        },
        multiLine : {
          beforeColon : true,
          afterColon  : true,
          align       : 'colon',
        },
      },
    ],
    'func-names'                        : 0,
    'arrow-parens'                      : 0,
    'arrow-body-style'                  : 0,
    'prefer-arrow-callback'             : 1,
    'prefer-destructuring'              : ['error', { object: true, array: false }],
    'lines-between-class-members'       : 0,
    'class-methods-use-this'            : 1,
    'import/prefer-default-export'      : 0,
    'import/no-unresolved'              : 0,
    'import/no-extraneous-dependencies' : 0,
    'template-curly-spacing'            : ['warn', 'always'],
    'sort-imports'                      : ['warn', {
      ignoreCase            : true,
      ignoreDeclarationSort : true,
      ignoreMemberSort      : false,
      memberSyntaxSortOrder : ['none', 'all', 'multiple', 'single'],
    }],
    'max-classes-per-file' : 0,
    'spaced-comment' : ['warn', 'always', { 
      block: { exceptions: ['#__PURE__'] } 
    }],
  },
};
