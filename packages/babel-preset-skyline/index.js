module.exports = (_, options) => {
  const sideEffectPlugin = require('@skyline/babel-plugin-effect');
  const sideEffect = require('skyline/dist/style/effects.json');

  const {
    theme = 'ios',
    fullImport = true,
    memberImport = true,
  } = options;

  const isDev = process.env.SKYLINE_ENV === 'development';

  const effect = (importName, isFullImport) => {
    importName = isFullImport ? 'default' : importName;

    const effect = sideEffect[importName];
    const effects = [
      effect[theme] || effect.base,
      sideEffect.bundle,
    ];

    return effects;
  };

  const config = {
    effect : !isDev && effect,
    fullImport,
    memberImport,
  };

  return {
    plugins : [
      [
        sideEffectPlugin,
        {
          skyline       : config,
          'skyline/src' : config,
        },
      ],
    ],
  };
};
