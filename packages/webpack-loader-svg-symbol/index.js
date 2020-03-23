const path = require('path');
const qs = require('querystring');
const SVGO = require('svgo');
const loaderUtils = require('loader-utils');
const { NS } = require('./plugin');

// svgo plugins config
const plugins = [
  { removeXMLNS: true },
  { cleanupListOfValues: true },
  { removeViewBox: false },
  { removeDimensions: true },
  { mergePaths: false }, // ionic icons has multiple path
  { removeAttrs: { attrs: '(data-.*)' } },
];

const optimize = async (svg, config) => {
  const svgo = new SVGO({ plugins, ...config });
  svg = await svgo.optimize(svg);
  return svg.data;
};

let errorEmitted = false;

module.exports = async function svgLoader(content) {
  const loaderContext = this;

  if (!errorEmitted && !loaderContext[NS]) {
    loaderContext.emitError(new Error(
      'svg-loader was used without the corresponding plugin. '
      + 'Make sure to include SVGLoaderPlugin in your webpack config.',
    ));
    errorEmitted = true;
  }

  const stringifyRequest = r => loaderUtils.stringifyRequest(loaderContext, r);
  const interpolateName = (n, o = {}) => loaderUtils.interpolateName(loaderContext, n, o);

  const {
    target,
    request,
    minimize,
    sourceMap,
    loaders,
    rootContext,
    resourcePath,
    resourceQuery,
    [NS]: collection,
  } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const inheritQuery = `&${ rawQuery }`;
  const incomingQuery = qs.parse(rawQuery);

  const filename = path.basename(resourcePath);
  const context = rootContext || process.cwd();
  const sourceRoot = path.dirname(path.relative(context, resourcePath));

  const options = loaderUtils.getOptions(loaderContext) || {};

  const {
    symbolId = '[name]',
    factory = (id) => `export default '${ id }'`,
    optimize: shouldOptimize = true,
    svgo,
  } = options;

  // If provided, call the symbolId option to get a customized ID
  // Otherwise interpolate the name to pull the file name out of the resource path and
  // use it as the svg symbol id
  const id = typeof symbolId === 'function'
    ? symbolId.call(loaderContext, resourcePath)
    : interpolateName(symbolId);

  const callback = loaderContext.async();

  try {
    const svg = shouldOptimize ? await optimize(content, svgo) : content;

    if (collection.has(id) && svg !== collection.get(id)) {
      console.warn(`symbol id: ${ id } is already setted, override it.`);
    }
    collection.set(id, svg);

    const code = factory(id);

    callback(null, code);
  } catch (error) {
    callback(error);
  }
};
