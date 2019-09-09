const ClipyMate = require('clipy-mate-core');

const ReadLine = require('./lib/readline');
const GitHubGist = require('./lib/github');
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

  const gist = new GitHubGist(settings);
  const res = await gist.readGist();

  console.log(res);

  clipy.disconnect();
  process.exit(0);
})();
