const arraify = (val) => (Array.isArray(val) ? val : [val]);

module.exports = (_, options) => {
  const { theme = 'ios', fullImport = true, memberImport = true } = options;
  const themes = arraify(theme);
  const plugin = require('@line-ui/babel-plugin-effect');
  const inspect = require('@line-ui/line/inspect');

  const effect = (importName, isFullImport) => {
    importName = isFullImport ? 'line' : importName;

    const effects = themes
      .map((theme) => inspect.dependence(importName, theme))
      .reduce((effects, val) => effects.concat(val), []);

    return inspect.dedupe(effects);
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
