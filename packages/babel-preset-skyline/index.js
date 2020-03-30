module.exports = (_, options) => {
  const {
    theme = 'ios',
    fullImport = true,
    memberImport = true,
  } = options;

  const plugin = require('@skyline/babel-plugin-effect');
  const inspect = require('skyline/inspect');

  const effect = (importName, isFullImport) => {
    importName = isFullImport ? 'skyline' : importName;
    const effect = inspect.effects.get(`${ importName }.${ theme }`) || inspect.effects.get(`${ importName }`);
    return [
      effect && effect,
      effect && inspect.effects.get('bundle'),
    ].filter(Boolean);
  };

  const config = new Proxy({}, {
    get(target, key, receiver) {
      if (key === inspect.name) {
        return {
          fullImport,
          memberImport,
          effect,
        };
      }
      if (inspect.effects.has(key)) {
        return {
          fullImport,
          memberImport,
          effect : () => effect(key, false),
        };
      }
      return Reflect.get(target, key, receiver);
    },
  });

  return {
    plugins : [
      [plugin, config],
    ],
  };
};
