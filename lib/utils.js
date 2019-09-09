'use strict';

const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

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
}

module.exports = Utils;
