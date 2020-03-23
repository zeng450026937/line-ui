const SVGO = require('svgo');

// svgo plugins config
const plugins = [
  { removeXMLNS: true },
  { cleanupListOfValues: true },
  { removeViewBox: false },
  { removeDimensions: true },
  { removeStyleElement: true },
  { removeScriptElement: true },
  { mergePaths: false }, // ionic icons has multiple path
  { removeAttrs: { attrs: '(data-.*)' } },
];

const optimize = async (svg, config) => {
  const svgo = new SVGO({ plugins, ...config });
  svg = await svgo.optimize(svg);
  return svg.data;
};

module.exports = optimize;
