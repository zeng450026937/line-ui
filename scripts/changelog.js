/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const execa = require('execa');

function changelog(dist, cmd) {
  const basepath = process.cwd();
  const tag = cmd.tag || 'v1.0.0';

  execa(`
    basepath=${ basepath }

    github_changelog_generator \
      --header-label "# 更新日志" \
      --bugs-label "**Bug Fixes**" \
      --enhancement-label "**Breaking changes**" \
      --issues-label "**Issue**" \
      --pr-label "**Features**" \
      --max-issues 0 \
      --no-author \
      --no-unreleased \
      --since-tag ${ tag } \
      -o ${ path.join(basepath, dist) }
    `);
}

module.exports = changelog;
