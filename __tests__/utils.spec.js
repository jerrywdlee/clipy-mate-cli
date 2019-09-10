'use strict';

const Utils = require('../lib/utils');

describe('Test Utils', () => {
  test('Should load json file', async () => {
    const jsonPath = './__tests__/settings.json';
    const json = await Utils.loadSettings(jsonPath);
    expect(json).toBeTruthy();
    expect(json.gitHubToken.length).toBe(40);
  });

  test('Should get argv keyword', async () => {
    const options = {
      upload: { _: [], upload: true, u: true },
      merge: { _: [], merge: true, m: true },
      force: { _: ['force'] },
    };

    for (const key in options) {
      expect(Utils.getArgvKeyword(options[key])).toBe(key);
    }
    expect(Utils.getArgvKeyword({ _: ['foo'] })).toBeFalsy();
    expect(Utils.getArgvKeyword({ _: [] })).toBeFalsy();
  });

  test('Should get settings parameters', async () => {
    expect(Utils.getGitHubInfo({ _: [] })).toBeFalsy();
    expect(Utils.getGitHubInfo({ _: [], merge: true, m: true })).toBeFalsy();

    let argv = { _: [], e: true, edit: true, t: 123 };
    try {
      expect(Utils.getGitHubInfo(argv)).toThrow();
    } catch (e) { }

    argv = { _: [], e: true, edit: true, t: 'a'.repeat(40) };
    let opt = Utils.getGitHubInfo(argv);
    expect(opt).toBeTruthy();
    expect(opt.gitHubToken).toBeTruthy();
    expect(opt.gistId).toBeFalsy();

    argv = { _: [], edit: true, t: 'a'.repeat(40), g: 'b'.repeat(32) };
    opt = Utils.getGitHubInfo(argv);
    expect(opt).toBeTruthy();
    expect(opt.gitHubToken).toBeTruthy();
    expect(opt.gistId).toBeTruthy();
  });
});
