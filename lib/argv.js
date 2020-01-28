'use strict';

const chalk = require('chalk');
const yargs = require('yargs');

const usageMsg = '`-e -t <YOUR TOKEN> [-g <YOUR GIST ID>]`';

const options = {
  u: { alias: 'upload', describe: 'Upload Snippets' },
  m: { alias: 'merge', describe: 'Download And Merge Snippets' },
  f: { alias: 'force', describe: `Force Update Snippets ${chalk.bold.red('[Danger!]')}` },
  e: { alias: 'edit', describe: `Edit Settings: ${chalk.yellow(usageMsg)}` },
}

const implies = {
  edit: 't',
}

const argv = yargs.alias('h', 'help').help()
  .alias('v', 'version').version(require('../package').version)
  .options(options).implies(implies).locale('en').argv;

module.exports = argv;
