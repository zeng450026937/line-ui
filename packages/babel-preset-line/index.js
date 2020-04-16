const arraify = (val) => (Array.isArray(val) ? val : [val]);

module.exports = (_, options) => {
  const { theme = 'ios', fullImport = true, memberImport = true } = options;
  const themes = arraify(theme);
  const plugin = require('@line-ui/babel-plugin-effect');
  const inspect = require('@line-ui/line/inspect');

  const effect = (importName, isFullImport) => {
    importName = isFullImport ? 'line' : importName;

    const effects = new Set();

    themes.forEach((theme) => {
      const effect =
        inspect.effects.get(`${importName}.${theme}`) ||
        inspect.effects.get(`${importName}`);

      if (!effect) return;

      effects.add(effect);

      const bundle = inspect.effects.get('bundle');

      if (!bundle) return;

      effects.add(bundle);
    });

    return Array.from(effects);
  };

  const config = new Proxy(
    {},
    {
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
            effect: () => effect(key, false),
          };
        }
        return Reflect.get(target, key, receiver);
      },
    }
  );

  return {
    plugins: [[plugin, config]],
  };
};
