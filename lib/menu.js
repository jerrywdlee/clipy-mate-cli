'use strict';

const inquirer = require('inquirer');

class Menu {
  constructor(settings, gist, readline) {
    this.opt = { ...settings };
    this.gist = gist;
    this.readline = readline;
  }

  async showMenu() {
    const actions = [
      {
        key: 'u',
        name: 'Upload Snippets',
        value: 'upload',
      }
    ];
    const clipyMateCli = await this.getClipyMateCli();
    if (clipyMateCli) {
      const { lastUpload } = clipyMateCli;
      actions.concat([
        {
          key: 'm',
          name: `Download And Merge Snippets (Last Updated: ${lastUpload})`,
          value: 'merge',
        },
        {
          key: 'f',
          name: `Force Update Snippets (Last Updated: ${lastUpload})`,
          value: 'force',
        },
      ]);
    }
    actions.push({
      key: 'e',
      name: `Edit Settings`,
      value: 'edit',
    })
    const ques = [
      {
        type: 'list',
        name: 'action',
        message: 'Chose An Action',
        choices: actions,
        filter: val => {
          return val.toLowerCase();
        }
      },
    ];

    const ans = await inquirer.prompt(ques);
    try {
      switch (ans.action) {
        case 'upload':

          break;
        case 'merge':

          break;
        case 'force':

          break;
        case 'edit':
          await this.readline.updateSettings();
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async getClipyMateCli() {
    try {
      const cliContent = this.gist.data.files.ClipyMateCli.content;
      const clipyMateCli = JSON.parse(cliContent);
      if (clipyMateCli.lastUpload) {
        return clipyMateCli;
      }
    } catch (err) {
      // console.warn(err);
    }
  }
}

module.exports = Menu;
