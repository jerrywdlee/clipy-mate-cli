'use strict';

const chalk = require('chalk');
const yargs = require('yargs');

const options = {
  upload: { alias: 'u', describe: 'Upload Snippets' },
  merge: { alias: 'm', describe: 'Download And Merge Snippets' },
  force: { alias: 'f', describe: `Force Update Snippets ${chalk.bold.red('[Danger!]')}` },
}

const argv = yargs.options(options).help().argv;

module.exports = argv;
