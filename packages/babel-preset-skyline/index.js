module.exports = (_, options) => {
  const sideEffectPlugin = require('@skyline/babel-plugin-effect');
  const sideEffect = require('skyline/style/sideEffect.json');

  const {
    theme = 'ios',
    fullImport = process.env.NODE_ENV === 'development',
    memberImport = true,
  } = options;

  return {
    plugins : [
      [
        sideEffectPlugin,
        {
          skyline : {
            effect(importName, isFullImport) {
              const effect = sideEffect[isFullImport ? 'default' : importName];
              const effects = [
                sideEffect.bundle,
                effect[theme] || effect.base,
              ];
              return effects;
            },
            fullImport,
            memberImport,
          },
        },
      ],
    ],
  };
};
