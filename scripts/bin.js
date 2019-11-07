#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
const commander = require('commander');
const changelog = require('./changelog');
const commitLint = require('./commit-lint');

commander
  .command('changelog <dir>')
  .option('--tag [tag]', 'Since tag')
  .action(changelog);

commander
  .command('commit-lint')
  .action(commitLint);

commander.parse(process.argv);
