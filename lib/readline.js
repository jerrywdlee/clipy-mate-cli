const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const inquirer = require('inquirer');

const access = promisify(fs.access);

const $HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

const opt = {
  clipyMateCliSettingsDir: path.join($HOME, '/.clipy-mate-cli'),
  clipyMateCliSettingsPath: path.join($HOME, '/.clipy-mate-cli/settings.json'),
  gitHubToken: '',
  gistId: '',
};

class ReadLine {
  constructor(clipy, options = {}) {
    this.clipy = clipy;
    this.opt = { ...opt, ...options };
  }

  async validateSettings() {
    const res = {
      clipyApp: false,
      clipyMateCliDir: false,
      clipyMateCliPath: false,
    };
    if (fs.existsSync(this.clipy.opt.realmPath)) {
      res.clipyApp = true;
    }
    if (fs.existsSync(this.opt.clipyMateCliSettingsDir)) {
      res.clipyMateCliDir = true;
    }
    if (fs.existsSync(this.opt.clipyMateCliSettingsPath)) {
      res.clipyMateCliPath = true;
    }
    return res;
  }

  async updateSettings() {
    const vaildRes = await this.validateSettings();
    const newOpt = {
      gitHubToken: this.opt.gitHubToken,
      gistId: this.opt.gistId,
      clipyRealmPath: this.clipy.opt.realmPath,
    };

    const questions = [];
    if (!vaildRes.clipyApp) {
      questions.push({
        type: 'input',
        name: 'gitHubToken',
        message: 'Please define where clipy app location:',
        default: this.clipy.opt.realmPath,
      });
    }

    questions.push({
      type: 'input',
      name: 'gitHubToken',
      message: `Please input your GitHub Token:`,
      default: this.opt.gitHubToken,
    })

    questions.push({
      type: 'input',
      name: 'gistId',
      message: `Please input your Gist Id, (Blank for init a new Gist):`,
      default: this.opt.gistId,
    })

    if (!vaildRes.clipyMateCliDir) {
      fs.mkdirSync(this.opt.clipyMateCliSettingsDir)
    }

    const ans = await inquirer.prompt(questions);

    const json = JSON.stringify({ ...newOpt, ...ans }, null, '\t');
    fs.writeFileSync(this.opt.clipyMateCliSettingsPath, json);
    console.log('Settings Updated!');
  }
}

module.exports = ReadLine;
