const findUp = require('find-up');
const path = require('path');

module.exports = (mod, { cwd } = {}) => {
  return findUp(
    async dir => {
      if (!dir) return;
      dir = path.join(dir, 'node_modules', mod);
      /* eslint-disable-next-line consistent-return */
      return await findUp.exists(dir) && dir;
    },
    { cwd, type: 'directory' },
  );
};

module.exports.sync = (mod, { cwd } = {}) => {
  return findUp.sync(
    dir => {
      if (!dir) return;
      dir = path.join(dir, 'node_modules', mod);
      /* eslint-disable-next-line consistent-return */
      return findUp.sync.exists(dir) && dir;
    },
    { cwd, type: 'directory' },
  );
};
