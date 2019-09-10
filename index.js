#!/usr/bin/env node
'use strict';

// create `realm-object-server` folder under `./realm`
// See https://github.com/realm/realm-js/issues/1235#issuecomment-520330071
const path = require('path');
process.chdir(path.join(__dirname, './realm'));

const ClipyMate = require('clipy-mate-core');

const ReadLine = require('./lib/readline');
const GitHubGist = require('./lib/github');
const argv = require('./lib/argv');
const Menu = require('./lib/menu');
const Utils = require('./lib/utils');

const clipy = new ClipyMate();
const readline = new ReadLine(clipy);

(async() => {
  try {
    const githubOpt = Utils.getGitHubInfo(argv);
    if (githubOpt) {
      await readline.updateSettings(githubOpt);
      clipy.disconnect();
      process.exit(0);
    }
  } catch (err) {
    console.error(err);
    clipy.disconnect();
    process.exit(1);
  }

  const vaildRes = await readline.validateSettings();
  const settingsPath = readline.opt.clipyMateCliSettingsPath;

  if (!vaildRes.clipyMateCliPath) {
    await readline.updateSettings();
  }
  const settings = await Utils.loadSettings(settingsPath);

  const github = new GitHubGist(settings);
  const res = await github.readGist();

  if (settings && res) {
    const menu = new Menu(settings, res, clipy, github, readline);
    const argvkey = Utils.getArgvKeyword(argv);
    await menu.showMenu(argvkey);
  }

  clipy.disconnect();
  process.exit(0);
})();
