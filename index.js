'use strict';

const ClipyMate = require('clipy-mate-core');

const ReadLine = require('./lib/readline');
const GitHubGist = require('./lib/github');
const argv = require('./lib/argv');
const Menu = require('./lib/menu');
const Utils = require('./lib/utils');

const clipy = new ClipyMate();
const readline = new ReadLine(clipy);

(async() => {
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
