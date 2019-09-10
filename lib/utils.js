'use strict';

const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const chalk = require('chalk');

class Utils {
  static async loadSettings(jsonPath) {
    const json = await readFile(jsonPath);
    return JSON.parse(json);
  }

  static getArgvKeyword(argv) {
    const list = ['upload', 'merge', 'force'];
    for (const key of list) {
      if (argv[key] || argv._.includes(key)) {
        return key;
      }
    }
  }

  static getGitHubInfo(argv) {
    if (argv['edit']) {
      const opt = { gitHubToken: argv.t };
      if (argv.g) {
        opt['gistId'] = argv.g;
      }
      if (opt.gitHubToken.length === 40) {
        return opt;
      } else {
        throw Error(chalk.red('Incorrect GitHub Token!'));
      }
    }
  }
}

module.exports = Utils;
