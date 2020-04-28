const qs = require('querystring');
const cheerio = require('cheerio');
const tapable = require('tapable');

const NS = 'tag-plugin';

class TagPlugin {
  static getHooks(compilation) {
    const names = ['beforeOptimize', 'optimize', 'afterOptimize'];
    return names.reduce((hooks, name) => {
      hooks[name] = compilation.hooks[`${NS}-${name}`];
      return hooks;
    }, {});
  }

  constructor(options = {}) {
    this.options = options;
  }

  /* eslint-disable-next-line */
  apply(compiler) {
    const usages = new Map();
    const seens = new WeakMap();
    let changes = new WeakMap();

    let sealed = false;
    let dirty = false;

    const report = (module, tag) => {
      const type = sealed ? changes : seens;
      const tags = type.get(module) || [];
      tags.push(tag);
      type.set(module, tags);
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

    // group tags
    const group = () => {
      const tags = [];
      usages.forEach((ts) => {
        tags.push(...ts);
      });
      return tags;
    };

    compiler.hooks.compilation.tap(NS, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(NS, (loaderContext) => {
        loaderContext[NS] = {
          report,
        };
      });
      // setup hooks
      const hooks = {
        // optimize stage
        beforeOptimize: new tapable.AsyncSeriesHook(['manifests', 'helper']),
        optimize: new tapable.AsyncSeriesHook(['manifests', 'helper']),
        afterOptimize: new tapable.AsyncSeriesHook(['manifests', 'helper']),
      };

      Object.keys(hooks).forEach((name) => {
        compilation.hooks[`${NS}-${name}`] = hooks[name];
      });

      if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapPromise(
          NS,
          async (htmlPluginData) => {
            const $ = cheerio.load(htmlPluginData.html);
            const tags = group();
            tags.forEach((tag) => {
              const { before, after, content } = tag;
              const node = $(content);
              if (before) {
                node.insertBefore(before);
                return;
              }
              if (after) {
                node.insertAfter(after);
                return;
              }
              node.insertAfter('head');
            });
            htmlPluginData.html = $.html();
            return htmlPluginData;
          }
        );
      }
    });

    compiler.hooks.make.tap(NS, (compilation) => {
      compilation.hooks.finishModules.tapPromise(NS, async (modules) => {
        // module parse finished
        seal(modules);
        sealed = true;
        // if no changes
        if (!dirty) return;
        // gen manifest and pass it with hooks
        const tags = group();
        const hooks = TagPlugin.getHooks(compilation);
        await hooks.beforeOptimize.promise(tags);
        await hooks.optimize.promise(tags);
        await hooks.afterOptimize.promise(tags);
        // mark no changes
        dirty = false;
      });
    });

    const rules = [
      {
        loader: require.resolve('./lib/tag-loader.js'),
        resourceQuery: (query) => {
          const parsed = qs.parse(query.slice(1));
          return /^(tag|head|body)$/.test(parsed.blockType);
        },
      },
    ];
    const rawRules = compiler.options.module.rules;
    // replace original rules
    compiler.options.module.rules = [...rawRules, ...rules];
  }
}

module.exports = TagPlugin;
