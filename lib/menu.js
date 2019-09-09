'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');

class Menu {
  constructor(settings, gist, clipy, github, readline) {
    this.opt = { ...settings };
    this.gist = gist;
    this.clipy = clipy;
    this.github = github;
    this.readline = readline;
  }

  async showMenu() {
    let actions = [
      {
        key: 'u',
        name: 'Upload Snippets',
        value: 'upload',
      }
    ];
    const clipyMateCli = await this.getClipyMateCli();
    if (clipyMateCli) {
      const { lastUpload } = clipyMateCli;
      const lastUploadStr = new Date(lastUpload).toLocaleString();
      actions = actions.concat([
        {
          key: 'm',
          name: `Download And Merge Snippets (Last: ${lastUploadStr})`,
          value: 'merge',
        },
        {
          key: 'f',
          name: `Force Update Snippets ${chalk.bold.red('[Danger!]')} (Last: ${lastUploadStr})`,
          value: 'force',
        },
      ]);
    }
    actions = actions.concat([
      {
        key: 'e',
        name: `Edit Settings`,
        value: 'edit',
      },
      {
        key: 'q',
        name: `Exit`,
        value: 'exit',
      },
    ])
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
          const snippets = await this.clipy.readSnippets();
          const jsonFile = JSON.stringify(snippets, null, '\t');
          const xmlFile = await this.clipy.buildXml(true, true);
          const cliFile = JSON.stringify({ lastUpload: new Date().toISOString() });
          const gistObject = {
            files: {
              "clipySnippets.json": { content: jsonFile },
              "clipySnippets.xml": { content: xmlFile },
              ClipyMateCli: { content: cliFile },
            },
          }
          const res = await this.github.uploadGist(gistObject)
          if (res) {
            console.log(chalk.green.bold(`  Snippets Uploaded!`));
          }
          break;
        case 'merge':
        case 'force':
          const jsonContent = this.gist.data.files['clipySnippets.json'].content;
          const snippetsObj = JSON.parse(jsonContent);
          if (ans.action === 'force') {
            // TODO: Active It
            // await this.clipy.clearAllSnippets()
            console.log('All Current Snippets Deleted!');
          }
          for (const folder of snippetsObj) {
            // console.log(folder);
            // TODO: Active It
            // await this.clipy.upsertFolder(folder);
          }
          let msg = `  Clipy Snippets Updated.\n`;
          msg += `  Restart Clipy App to Refresh Snippets.`
          console.log(chalk.green.bold(msg));
          break;
        case 'edit':
          await this.readline.updateSettings();
          break;
        case 'exit':
          return 'exit';
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
