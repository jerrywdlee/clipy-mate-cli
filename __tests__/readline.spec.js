'use strict';

const path = require('path');
const ClipyMate = require('clipy-mate-core');

const ReadLine = require('../lib/readline');
const Utils = require('../lib/utils');

const clipyOpt = { realmPath: path.join(__dirname, './default.realm') };
const readlineOpt = {
  clipyMateCliSettingsDir: path.join(__dirname, '/.clipy-mate-cli'),
  clipyMateCliSettingsPath: path.join(__dirname, '/.clipy-mate-cli/settings.json'),
};
const clipy = new ClipyMate(clipyOpt);
const readline = new ReadLine(clipy, readlineOpt);

describe('Test ReadLine', () => {

  afterAll(async () => {
    clipy.disconnect();
  });

  test('Should validate settings', async () => {
    const vaildRes = await readline.validateSettings();
    expect(vaildRes.clipyApp).toBeTruthy();
    expect(vaildRes.clipyMateCliDir).toBeFalsy();
    expect(vaildRes.clipyMateCliPath).toBeFalsy();
  });

  test('Should setup settings', async () => {
    const githubOpt = {
      gitHubToken: 'a'.repeat(40),
      gistId: 'b'.repeat(32),
    }
    await readline.updateSettings(githubOpt);

    const vaildRes = await readline.validateSettings();
    expect(vaildRes.clipyMateCliDir).toBeTruthy();
    expect(vaildRes.clipyMateCliPath).toBeTruthy();
    const jsonPath = readline.opt.clipyMateCliSettingsPath;
    const json = await Utils.loadSettings(jsonPath);
    expect(json.gitHubToken).toBe('a'.repeat(40));
    expect(json.gistId).toBe('b'.repeat(32));
  });
});
