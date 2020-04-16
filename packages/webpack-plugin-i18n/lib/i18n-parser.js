const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const BasicEvaluatedExpression = require('webpack/lib/BasicEvaluatedExpression');
const helper = require('webpack/lib/ParserHelpers');
const path = require('path');
const Replacer = require('./replacer');

const NS = 'i18n-parser';

const DEFAULT_CONFIG = {
  replace: false,
  filename: 'translations.json',
  emit: true,
  method: '$t',
  provide: '__I18N_DATA__',
  runtime: '@line-ui/webpack-plugin-i18n/runtime',
};

// collect tr call from .js/.ts/.vue
class I18nParser {
  constructor(options) {
    this.options = { ...DEFAULT_CONFIG, ...options };
    this.seens = new WeakMap();
    this.translations = new Map();
    this.provides = new Map();
  }

  apply(compiler) {
    const relative = (p) => {
      return path.relative(compiler.context, p).replace(/\\/g, '/');
    };

    const { method, provide, runtime } = this.options;

    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.buildModule.tap(NS, (module) => {
        this.seens.delete(module);
      });
      compilation.hooks.finishModules.tap(NS, (modules) => {
        this.seal(modules);
      });

      compilation.hooks.beforeChunkAssets.tap(NS, () => {
        if (!this.options.replace) return;
        this.translations.forEach((replacements, module) => {
          Replacer.replaceInModuleSource(module, replacements, compilation);
        });
        this.provides.forEach((replacements, module) => {
          Replacer.replaceInModuleSource(module, replacements, compilation);
        });
      });

      compilation.hooks.additionalAssets.tapPromise(NS, async () => {
        if (!this.options.emit) return;
        await this.hookAdditionalAssets(compilation);
      });
    });

    compiler.hooks.normalModuleFactory.tap(NS, (factory) => {
      const handler = (parser) => {
        const hookCall = (expression) => {
          const { resource } = parser.state.current;

          if (/node_modules/.test(resource)) {
            return;
          }

          const { arguments: args } = expression;

          if (!args.length) return;

          const arg = args[0];
          const evaluated = parser.evaluateExpression(arg);

          if (!evaluated.isString()) return;

          const text = evaluated.string;
          const file = relative(resource);
          const disambiguation = '';

          const replacements = this.translate(parser.state.current);

          replacements.push({
            text,
            file,
            disambiguation,
            token: text,
            replaceTo: '',
            start: arg.start,
            end: arg.end - 1,
          });

          if (/\.vue\?vue&type=template/.test(resource)) return;

          const request = [].concat(runtime);
          let requestExpr = `require(${JSON.stringify(request[0])})`;
          if (request.length > 1) {
            requestExpr += request
              .slice(1)
              .map((r) => `[${JSON.stringify(r)}]`)
              .join('');
          }

          helper.addParsedVariableToModule(parser, method, requestExpr);
        };

        parser.hooks.call.for(method).tap(NS, hookCall);
        parser.hooks.call.for(`_vm.${method}`).tap(NS, hookCall);

        parser.hooks.evaluate.for('MemberExpression').tap(NS, (expression) => {
          const { resource } = parser.state.current;

          if (!/\.vue\?vue&type=template/.test(resource)) return;

          const { object, property } = expression;

          if (!object || !property) return;
          if (object.name !== '_vm') return;
          if (property.name !== method) return;

          const exprName = parser.getNameForExpression(expression);
          const identifier = exprName.name;

          return new BasicEvaluatedExpression()
            .setRange(expression.range)
            .setIdentifier(identifier)
            .setExpression(expression);
        });

        parser.hooks.expression.for(provide).tap(NS, (expression) => {
          const replacements = this.provide(parser.state.current);

          replacements.push({
            token: expression.name,
            replaceTo: '[]',
            start: expression.start,
            end: expression.end - 1,
          });
        });
      };

      factory.hooks.parser.for('javascript/auto').tap(NS, handler);
      factory.hooks.parser.for('javascript/dynamic').tap(NS, handler);
      factory.hooks.parser.for('javascript/esm').tap(NS, handler);
    });

    compiler.hooks.compilation.tap(NS, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(NS, (loaderCtx) =>
        this.hookNormalModuleLoader(loaderCtx)
      );

      compilation.dependencyFactories.set(ConstDependency, new NullFactory());
      compilation.dependencyTemplates.set(
        ConstDependency,
        new ConstDependency.Template()
      );
    });
  }

  hookNormalModuleLoader(loaderContext) {
    loaderContext[NS] = this;
  }

  async hookAdditionalAssets(compilation) {
    const { publicPath } = compilation.outputOptions;
    const files = this.groupByFileName();
    files.forEach(({ filename, replacements }) => {
      if (filename) {
        const content = JSON.stringify(replacements, null, 2);
        compilation.assets[resolvePath(publicPath, filename)] = {
          source: () => content,
          size: () => content.length,
        };
      }
    });
  }

  seen(module) {
    let seen = this.seens.get(module);
    if (!seen) {
      seen = {
        translations: [],
        provides: [],
      };
      this.seens.set(module, seen);
    }
    return seen;
  }

  translate(module) {
    return this.seen(module).translations;
  }

  provide(module) {
    return this.seen(module).provides;
  }

  seal(modules) {
    this.translations = new Map();
    this.provides = new Map();

    const data = [];

    modules.forEach((module) => {
      const seen = this.seens.get(module);
      if (!seen) return;
      if (seen.translations.length) {
        seen.translations.forEach((r) => {
          r.replaceTo = JSON.stringify(data.push(r.text) - 1);
        });
        this.translations.set(module, seen.translations);
      }
      if (seen.provides.length) {
        this.provides.set(module, seen.provides);
      }
    });

    this.provides.forEach((provides) => {
      provides.forEach((r) => {
        r.replaceTo = JSON.stringify(data);
      });
    });
  }

  groupByFileName() {
    const { options } = this;
    const files = [];

    Array.from(this.translations.keys()).forEach((module) => {
      const replacements = this.translations.get(module) || [];
      const chunk = Replacer.getModuleChunk(module);
      let filename;

      if (options.filename && options.emit) {
        filename =
          typeof options.filename === 'function'
            ? options.filename(module)
            : options.filename;

        if (filename.includes('[chunkname]') && chunk && chunk.name) {
          filename = filename.replace('[chunkname]', chunk.name);
        }
      }

      let file = files.find((s) => s.filename === filename);
      if (!file) {
        file = { filename, replacements: replacements.slice() };
        files.push(file);
      } else {
        file.replacements.push(...replacements);
      }
    });

    return files;
  }
}

const SEPARATOR = '/';
const resolvePath = (...args) => {
  return args.join(SEPARATOR).split(SEPARATOR).filter(Boolean).join(SEPARATOR);
};

module.exports = I18nParser;
