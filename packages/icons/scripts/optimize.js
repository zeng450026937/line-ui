const fs = require('fs-extra');
const SVGO = require('svgo');

const configs = [
  { removeXMLNS: true },
  { cleanupListOfValues: true },
  { removeViewBox: false },
  { removeDimensions: true },
  { mergePaths: false }, // ionic icons has multiple path
  { removeAttrs: { attrs: '(data-.*)' } },
];

const svgo = new SVGO({ plugins: configs });

module.exports = async (file) => {
  const data = await fs.readFile(file, 'utf-8');
  const svg = await svgo.optimize(data);
  return svg;
};
