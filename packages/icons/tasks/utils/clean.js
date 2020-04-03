const fs = require('fs-extra');

module.exports = (dirs) => {
  if (!Array.isArray(dirs)) {
    dirs = [dirs];
  }
  return () => Promise.all(dirs.map((dir) => fs.remove(dir)));
};
