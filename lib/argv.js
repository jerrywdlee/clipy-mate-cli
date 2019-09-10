'use strict';

const chalk = require('chalk');
const yargs = require('yargs');

const usageMsg = '`-e -t <YOUR TOKEN> -g <YOUR GIST ID (Optional)>`';

const options = {
  upload: { alias: 'u', describe: 'Upload Snippets' },
  merge: { alias: 'm', describe: 'Download And Merge Snippets' },
  force: { alias: 'f', describe: `Force Update Snippets ${chalk.bold.red('[Danger!]')}` },
  edit: { alias: 'e', describe: `Edit Settings: ${chalk.yellow(usageMsg)}` },
}

const implies = {
  edit: 't',
}

const argv = yargs.options(options).implies(implies).help().locale('en').argv;

module.exports = argv;
