const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const tapable = require('tapable');

const NS = 'config-provide';

class ConfigProvide {
  static getHooks(compilation) {
    const names = ['beforeOptimize', 'optimize', 'afterOptimize'];
    return names.reduce((hooks, name) => {
      hooks[name] = compilation.hooks[`${NS}-${name}`];
      return hooks;
    }, {});
  }

  constructor(options = {}) {
    this.options = options;
    this.usages = new Map();
    this.configs = undefined;
  }

  apply(compiler) {
    const {
      provide = '__CONFIG_RUNTIME__',
      includes = [],
      excludes = [],
      configs = {},
    } = this.options;

    this.configs = configs;

    const seens = new WeakMap();

    const report = (module, replacement) => {
      const replacements = seens.get(module) || [];
      replacements.push(replacement);
      seens.set(module, replacements);
    };

    const seal = (modules) => {
      this.usages.clear();

      for (const module of modules) {
        const seen = seens.get(module);
        if (seen) {
          this.usages.set(module, seen);
        }
      }
    };

    compiler.hooks.compilation.tap(NS, (compilation) => {
      // hook module loader
      compilation.hooks.normalModuleLoader.tap(NS, (loaderContext) => {
        // allow loader access plugin
        loaderContext[NS] = this;
      });

      // setup dependency
      compilation.dependencyFactories.set(ConstDependency, new NullFactory());
      compilation.dependencyTemplates.set(
        ConstDependency,
        new ConstDependency.Template()
      );

      // setup hooks
      const hooks = {
        // optimize stage
        beforeOptimize: new tapable.AsyncSeriesWaterfallHook(['configs']),
        optimize: new tapable.AsyncSeriesWaterfallHook(['configs']),
        afterOptimize: new tapable.AsyncSeriesWaterfallHook(['configs']),
      };

      Object.keys(hooks).forEach((name) => {
        compilation.hooks[`${NS}-${name}`] = hooks[name];
      });
    });

    compiler.hooks.make.tap(NS, (compilation) => {
      compilation.hooks.buildModule.tap(NS, (module) => {
        seens.delete(module);
      });
      compilation.hooks.finishModules.tapPromise(NS, async (modules) => {
        seal(modules);

        let optimized = this.configs;
        const hooks = ConfigProvide.getHooks(compilation);

        optimized = await hooks.beforeOptimize.promise(optimized);
        optimized = await hooks.optimize.promise(optimized);
        optimized = await hooks.afterOptimize.promise(optimized);

        if (optimized) {
          this.replace(optimized);
        }
      });
    });

    compiler.hooks.normalModuleFactory.tap(NS, (factory) => {
      const handler = (parser) => {
        const replace = (expression, value) => {
          const dep = new ConstDependency(value, expression.range, false);
          dep.loc = expression.loc;
          parser.state.current.addDependency(dep);
          return dep;
        };

        parser.hooks.expression.for(provide).tap(NS, (expression) => {
          const { resource } = parser.state.current;

          const includesRegex = genTranspileRegex(includes);
          const excludesRegex = genTranspileRegex(excludes);

          if (excludesRegex && excludesRegex.test(resource)) {
            return;
          }
          if (includesRegex && !includesRegex.test(resource)) {
            return;
          }

          const dep = replace(expression, JSON.stringify(configs));

          const replacement = {
            token: expression.name,
            get replaceTo() {
              return JSON.parse(dep.expression);
            },
            set replaceTo(val) {
              dep.expression = JSON.stringify(val);
            },
          };

          // report replacement
          report(parser.state.current, replacement);
        });
      };

      factory.hooks.parser.for('javascript/auto').tap(NS, handler);
      factory.hooks.parser.for('javascript/dynamic').tap(NS, handler);
      factory.hooks.parser.for('javascript/esm').tap(NS, handler);
    });
  }

  replace(val) {
    if (val === this.configs) return;
    this.usages.forEach((replacements) => {
      replacements.forEach((r) => {
        r.replaceTo = val;
      });
    });
    this.configs = val;
  }
}

function genTranspileRegex(transpiles) {
  const deps = transpiles
    .map((dep) => {
      if (dep instanceof RegExp) {
        return dep.source;
      }
      return `${dep}`;
    })
    .filter(Boolean);
  return deps.length ? new RegExp(deps.join('|')) : null;
}

module.exports = ConfigProvide;
