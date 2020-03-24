const glob = require('glob');
const path = require('path');
const gulp = require('gulp');
const clean = require('./tasks/utils/clean');

const loadTasks = () => {
  return glob.sync(`${ path.resolve('./tasks') }/*.js`)
    .map(p => {
      const name = path.basename(p, '.js');
      const task = require(p);
      exports[name] = task;
      gulp.task(name, task);
      return name;
    });
};

const tasks = loadTasks();

exports.default = gulp.series(
  clean(path.resolve(__dirname, 'dist')),
  ...tasks,
  clean(path.resolve(__dirname, 'packages')),
);
