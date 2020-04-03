const qs = require('querystring');
const loaderUtils = require('loader-utils');

const isPitcher = (l) => l.path !== __filename;

module.exports = (code) => code;

module.exports.pitch = function (remainingRequest) {
  const loaderContext = this;

  const { resourcePath, resourceQuery } = loaderContext;

  // remove self
  const loaders = loaderContext.loaders.filter(isPitcher);

  const rawQuery = resourceQuery.slice(1);
  const inheritQuery = `&${rawQuery}`;
  const incomingQuery = qs.parse(rawQuery);

  const stringifyRequest = (r) =>
    loaderUtils.stringifyRequest(loaderContext, r);
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

    loaders.forEach((loader) => {
      const identifier =
        typeof loader === 'string' ? loader : loader.path + loader.query;
      const request = typeof loader === 'string' ? loader : loader.request;
      if (!seen.has(identifier)) {
        seen.set(identifier, true);
        // loader.request contains both the resolved loader path and its options
        // query (e.g. ??ref-0)
        loaderStrings.push(request);
      }
    });

    return stringifyRequest(
      `-!${[...loaderStrings, url || resourcePath + resourceQuery].join('!')}`
    );
  };

  const options = loaderUtils.getOptions(loaderContext);

  // Inject babel loader
  const request = genRequest([
    `${require.resolve('babel-loader')}`,
    ...loaders,
  ]);

  return `
import mod from ${request};
export default mod;
export * from ${request};
  `.trim();
};
