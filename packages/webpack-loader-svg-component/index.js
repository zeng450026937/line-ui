const path = require('path');
const qs = require('querystring');
const loaderUtils = require('loader-utils');
const optimize = require('./optimize');

module.exports = async function svgLoader(content) {
  const loaderContext = this;

  const stringifyRequest = r => loaderUtils.stringifyRequest(loaderContext, r);
  const interpolateName = (n, o) => loaderUtils.interpolateName(loaderContext, n, o);

  const genRequest = (loaders, url) => {
    // Important: dedupe since both the original rule
    // and the cloned rule would match a source import request.
    // also make sure to dedupe based on loader path.
    // assumes you'd probably never want to apply the same loader on the same
    // file twice.
    // Exception: in Vue CLI we do need two instances of postcss-loader
    // for user config and inline minification. So we need to dedupe baesd on
    // path AND query to be safe.
    const seen = new Map();
    const loaderStrings = [];

    loaders.forEach(loader => {
      const identifier = typeof loader === 'string'
        ? loader
        : (loader.path + loader.query);
      const request = typeof loader === 'string' ? loader : loader.request;
      if (!seen.has(identifier)) {
        seen.set(identifier, true);
        // loader.request contains both the resolved loader path and its options
        // query (e.g. ??ref-0)
        loaderStrings.push(request);
      }
    });

    return stringifyRequest(`-!${ [
      ...loaderStrings,
      url || resourcePath + resourceQuery,
    ].join('!') }`);
  };

  const {
    target,
    request,
    minimize,
    sourceMap,
    loaders,
    rootContext,
    resourcePath,
    resourceQuery,
  } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const inheritQuery = `&${ rawQuery }`;
  const incomingQuery = qs.parse(rawQuery);

  const filename = path.basename(resourcePath);
  const context = rootContext || process.cwd();
  const sourceRoot = path.dirname(path.relative(context, resourcePath));

  const options = loaderUtils.getOptions(loaderContext) || {};

  const callback = loaderContext.async();

  if (incomingQuery.component != null) {
    const {
      factory = (data) => `export default () => (${ data });`,
      optimize: shouldOptimize = true,
      svgo,
    } = options;

    const svg = shouldOptimize ? await optimize(content, svgo) : content;

    const code = factory(svg);

    callback(null, code);

    return;
  }

  const { transpile } = options;

  const transpileRE = genTranspileRegex(transpile);

  if (!transpileRE || (transpileRE && transpileRE.test(resourcePath))) {
    const src = resourcePath;
    const query = `?component&type=script&lang=jsx${ inheritQuery }`;

    const jsxRequest = genRequest(
      [
        `${ require.resolve('babel-loader') }`,
        ...loaders,
      ],
      src + query,
    );

    callback(null, `export { default } from ${ jsxRequest }`);

    return;
  }

  callback(null, content);
};

const isWindows = process.platform === 'win32';

function genTranspileRegex(transpile = []) {
  const deps = transpile.map(dep => {
    if (dep instanceof RegExp) {
      return dep.source;
    }
    const depPath = path.normalize(dep);
    return isWindows
      ? depPath.replace(/\\/g, '\\\\') // double escape for windows style path
      : depPath;
  });
  return deps.length ? new RegExp(deps.join('|')) : null;
}
