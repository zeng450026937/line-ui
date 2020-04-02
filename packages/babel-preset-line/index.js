module.exports = (_, options) => {
  const {
    theme = 'ios',
    fullImport = true,
    memberImport = true,
  } = options;

  const plugin = require('@line-ui/babel-plugin-effect');
  const inspect = require('@line-ui/line/inspect');

  const effect = (importName, isFullImport) => {
    importName = isFullImport ? 'line' : importName;
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
