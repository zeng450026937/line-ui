const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const BasicEvaluatedExpression = require('webpack/lib/BasicEvaluatedExpression');
const { getHashDigest } = require('loader-utils');

const NS = 'i18n-plugin';

function generateToken(text, disambiguation) {
  const value = [
    NS,
    text,
    disambiguation,
  ].filter(Boolean).join('');

  return `${ getHashDigest(value) }`;
}

// Collect tr call from js/ts
class I18nPlugin {
  constructor(config) {
    this.config = config;
    this.translations = [];
  }

  apply(compiler) {
    compiler.hooks
      .thisCompilation
      .tap(NS, compilation => {
        compilation.hooks
          .additionalAssets
          .tapPromise(NS, () => this.hookAdditionalAssets(compilation));
      });

    compiler.hooks
      .normalModuleFactory
      .tap(NS, factory => {
        const handler = parser => {
          const hookCall = expression => {
            const { arguments: args } = expression;

            if (!args.length) return;

            const evaluated = parser.evaluateExpression(args[0]);

            if (!evaluated.isString()) return;

            const text = evaluated.string;
            const disambiguation = parser.state.current.resource;

            this.translations.push({
              id : generateToken(text, disambiguation),
              text,
              disambiguation,
              toString() {
                return this.text;
              },
            });
          };
          parser.hooks
            .call.for('tr')
            .tap(NS, hookCall);

          parser.hooks
            .call.for('_vm.tr')
            .tap(NS, hookCall);

          parser.hooks
            .evaluate.for('MemberExpression')
            .tap(NS, expression => {
              const res = parser.state.current.resource;

              if (!/\.vue/.test(res)) return;

              const { object, property } = expression;

              if (!object || !property) return;
              if (property.name !== 'tr') return;

              const exprName = parser.getNameForExpression(expression);
              const identifier = exprName.name;
              /* eslint-disable-next-line */
              return new BasicEvaluatedExpression()
                .setRange(expression.range)
                .setIdentifier(identifier)
                .setExpression(expression);
            });
        };

        factory.hooks
          .parser.for('javascript/auto')
          .tap(NS, handler);

        factory.hooks
          .parser.for('javascript/dynamic')
          .tap(NS, handler);

        factory.hooks
          .parser.for('javascript/esm')
          .tap(NS, handler);
      });

    compiler.hooks
      .compilation
      .tap(NS, compilation => {
        compilation.hooks
          .normalModuleLoader
          .tap(NS, loaderCtx => this.hookNormalModuleLoader(loaderCtx));

        compilation.dependencyFactories.set(ConstDependency, new NullFactory());
        compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
      });
  }

  hookNormalModuleLoader(loaderContext) {
    loaderContext[NS] = this;
  }

  async hookAdditionalAssets(compilation) {
    const content = JSON.stringify(this.translations, null, 2);
    compilation.assets['translation.json'] = {
      source : () => content,
      size   : () => content.length,
    };
  }
}

module.exports = I18nPlugin;
