const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const BasicEvaluatedExpression = require('webpack/lib/BasicEvaluatedExpression');
const helper = require('webpack/lib/ParserHelpers');
const path = require('path');
const tapable = require('tapable');

const NS = 'config-parser';

class ConfigParser {
  static getHooks(compilation) {
    const names = [
      'beforeOptimize',
      'optimize',
      'afterOptimize',
      'beforeProcess',
      'process',
      'afterProcess',
    ];
    return names.reduce((hooks, name) => {
      hooks[name] = compilation.hooks[`${NS}-${name}`];
      return hooks;
    }, {});
  }

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const {
      manifest = 'config/manifest.json',
      filename = 'config/config.json',
      emit = true,
      method = '$config',
      runtime = '@line-ui/webpack-plugin-config/runtime',
      vue = true,
      vueobject = '_vm',
    } = this.options;

    const usages = new Map();
    const seens = new WeakMap();
    let changes = new WeakMap();

    let sealed = false;
    let dirty = false;

    const report = (module, config) => {
      const type = sealed ? changes : seens;
      const configs = type.get(module) || [];
      configs.push(config);
      type.set(module, configs);
    };

    const isEqual = (x, y) => JSON.stringify(x) === JSON.stringify(y);
    const seal = (modules) => {
      // clear usages
      usages.clear();
      // collect usages & dirty check
      for (const module of modules) {
        // seen configs
        const seen = seens.get(module);
        // changed configs
        const changed = changes.get(module);
        // dirty check
        if (!dirty) {
          dirty = !isEqual(seen, changed);
        }
        const final = changed || seen;
        // update seen configs
        seens.set(module, final);
        // add usage
        if (final) {
          usages.set(module, final);
        }
      }
      // clear changes
      changes = new WeakMap();
    };

    // group configs by file
    const group = (filename) => {
      const files = [];
      usages.forEach((configs, module) => {
        const chunk = getModuleChunk(module);
        let name = '';
        if (filename) {
          name = isFunction(filename) ? filename(module) : filename;
          if (name.includes('[chunkname]') && chunk && chunk.name) {
            name = name.replace('[chunkname]', chunk.name);
          }
        }
        let file = files.find((s) => s.name === name);
        if (!file) {
          file = { name, configs: configs.slice() };
          files.push(file);
        } else {
          file.configs.push(...configs);
        }
      });
      return files;
    };

    const help = () => {
      return {
        options: this.options,
        usages,
        seens,
        changes,
        group,
      };
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
        beforeOptimize: new tapable.AsyncSeriesHook(['manifests', 'helper']),
        optimize: new tapable.AsyncSeriesHook(['manifests', 'helper']),
        afterOptimize: new tapable.AsyncSeriesHook(['manifests', 'helper']),
        // process stage
        beforeProcess: new tapable.AsyncSeriesHook(['configs', 'helper']),
        process: new tapable.AsyncSeriesHook(['configs', 'helper']),
        afterProcess: new tapable.AsyncSeriesHook(['configs', 'helper']),
      };

      Object.keys(hooks).forEach((name) => {
        compilation.hooks[`${NS}-${name}`] = hooks[name];
      });
    });

    compiler.hooks.make.tap(NS, (compilation) => {
      compilation.hooks.finishModules.tapPromise(NS, async (modules) => {
        // module parse finished
        seal(modules);
        sealed = true;
        // if no changes
        if (!dirty) return;
        // gen manifest and pass it with hooks
        const manifests = group('manifest');
        const helper = help();
        const hooks = ConfigParser.getHooks(compilation);
        await hooks.beforeOptimize.promise(manifests, helper);
        await hooks.optimize.promise(manifests, helper);
        await hooks.afterOptimize.promise(manifests, helper);
        // mark no changes
        dirty = false;
      });

      compilation.hooks.additionalAssets.tapPromise(NS, async () => {
        // if no emit
        if (!emit) return;
        // gen assets and pass them with hooks
        const files = [];
        const { publicPath } = compilation.outputOptions;

        // gen manifest
        let assets;
        assets = group(manifest);

        files.push(...assets);

        // gen assets
        assets = group(filename);

        // preprocess
        // turn manifest item into key/value pair
        for (const asset of assets) {
          asset.configs = asset.configs.reduce((configs, config) => {
            configs[config.replaceTo] = config.fallback;
            return configs;
          }, {});
        }

        const helper = help();
        const hooks = ConfigParser.getHooks(compilation);
        await hooks.beforeProcess.promise(assets, helper);
        await hooks.process.promise(assets, helper);
        await hooks.afterProcess.promise(assets, helper);

        files.push(...assets);

        for (const file of files) {
          const { name, configs } = file;
          if (!name) return;
          const content = JSON.stringify(configs, null, 2);
          compilation.assets[resolvePath(publicPath, name)] = {
            source: () => content,
            size: () => content.length,
          };
        }
      });
    });

    const relative = (p) => {
      return path.relative(compiler.context, p).replace(/\\/g, '/');
    };

    compiler.hooks.normalModuleFactory.tap(NS, (factory) => {
      const handler = (parser) => {
        const replace = (expression, value) => {
          const dep = new ConstDependency(value, expression.range, false);
          dep.loc = expression.loc;
          parser.state.current.addDependency(dep);
          return dep;
        };
        const isVueTemplate = (resource) =>
          /\.vue\?vue&type=template/.test(resource);

        const error = (expr) => {
          throw new Error(`
    ${NS}: Only json-like config is supported.
    ${relative(parser.state.current.resource)}
    at ${expr.start}~${expr.end} ${expr.type}
          `);
        };

        const walk = (expr) => {
          let value = '';
          switch (expr.type) {
            case 'ArrayExpression':
              value = walkArray(expr);
              break;
            case 'ObjectExpression':
              value = walkObject(expr);
              break;
            case 'Identifier':
              value = expr.name;
              break;
            case 'Literal':
              value = expr.value;
              break;
            case 'TemplateLiteral':
              value = parser.evaluateExpression(expr).string;
              if (value === null) error(expr);
              break;
            default:
              error(expr);
              break;
          }
          return value;
        };
        const walkArray = (expr) => {
          const value = [];
          if (expr.elements) {
            for (const element of expr.elements) {
              value.push(walk(element));
            }
          }
          return value;
        };
        const walkObject = (expr) => {
          const value = {};
          for (
            let propIndex = 0, len = expr.properties.length;
            propIndex < len;
            propIndex++
          ) {
            const prop = expr.properties[propIndex];
            if (prop.type === 'SpreadElement') {
              Object.assign(value, walk(prop.argument));
              continue;
            }
            value[walk(prop.key)] = walk(prop.value);
          }
          return value;
        };

        const parse = (expr) => {
          if ('value' in expr) {
            return expr.value;
          }
          return walk(expr);
        };

        const call = (expression) => {
          const { resource } = parser.state.current;
          // if comes from node_modules, ignore it
          if (/node_modules\//.test(resource)) return;

          const { arguments: args } = expression;
          // config without args
          if (!args.length) return;

          const [arg1, arg2] = args;

          const key = parse(arg1);
          const fallback = parse(arg2);
          const file = relative(resource);
          // if no config key
          if (!key) return;

          const dep = replace(arg1, JSON.stringify(key));

          const config = {
            key,
            fallback,
            file,
            // for key optimization
            get replaceTo() {
              return JSON.parse(dep.expression);
            },
            set replaceTo(val) {
              dep.expression = JSON.stringify(val);
            },
          };

          // report config
          report(parser.state.current, config);

          // if is vue template, no runtime is needed
          if (isVueTemplate(resource)) return;

          variable();
        };
        parser.hooks.call.for(method).tap(NS, call);

        const variable = () => {
          // inject runtime
          const request = [].concat(isFunction(runtime) ? runtime() : runtime);
          let requestExpr = `require(${JSON.stringify(request[0])})`;
          // support array runtime, which will be parsed into runtime member
          // eg. [a, b] => a.b
          if (request.length > 1) {
            requestExpr += request
              .slice(1)
              .map((r) => `[${JSON.stringify(r)}]`)
              .join('');
          }

          helper.addParsedVariableToModule(parser, method, requestExpr);
        };
        parser.hooks.expression.for(method).tap(NS, variable);

        // should we check vue template
        if (!vue) return;
        // special hook for vue template parsing
        const member = (expression) => {
          const { resource } = parser.state.current;
          // if not vue template
          if (!isVueTemplate(resource)) return;

          const { object, property } = expression;

          if (!object || !property) return;
          if (object.name !== `${vueobject}`) return;
          if (property.name !== method) return;

          const exprName = parser.getNameForExpression(expression);
          const identifier = exprName.name;

          return new BasicEvaluatedExpression()
            .setRange(expression.range)
            .setIdentifier(identifier)
            .setExpression(expression);
        };
        parser.hooks.evaluate.for('MemberExpression').tap(NS, member);
        parser.hooks.call.for(`${vueobject}.${method}`).tap(NS, call);
      };

      factory.hooks.parser.for('javascript/auto').tap(NS, handler);
      factory.hooks.parser.for('javascript/dynamic').tap(NS, handler);
      factory.hooks.parser.for('javascript/esm').tap(NS, handler);
    });
  }
}

const getModuleChunk = (module) => {
  const chunks = Array.from(module.chunksIterable);
  if (Array.isArray(chunks) && chunks.length > 0) {
    return chunks[chunks.length - 1];
  }
  if (module.issuer) {
    return getModuleChunk(module.issuer);
  }
  return null;
};

const SEPARATOR = '/';
const resolvePath = (...args) => {
  return args.join(SEPARATOR).split(SEPARATOR).filter(Boolean).join(SEPARATOR);
};

const isFunction = (val) => typeof val === 'function';

module.exports = ConfigParser;
