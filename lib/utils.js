'use strict';

const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

class Utils {
  static async loadSettings(jsonPath) {
    const json = await readFile(jsonPath);
    return JSON.parse(json);
  }
}

module.exports = Utils;
