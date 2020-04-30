module.exports = function StringLoader(content) {
  return `export default ${JSON.stringify(content)}`;
};
