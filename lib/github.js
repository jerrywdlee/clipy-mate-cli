'use strict';

// https://github.com/settings/tokens/new

const { Octokit } = require("@octokit/rest");
const ora = require('ora');

const GIST_EMPTY = {
  description: "Clipy Mate Sync Settings Gist",
  public: false,
  files: {
    "clipySnippets.json": {
      content: "// Empty"
    },
    "clipySnippets.xml": {
      content: "<!-- Empty -->"
    },
    ClipyMateCli: {
      content: "// Empty"
    },
  },
};

class GitHubGist {
  constructor(settings) {
    const { gitHubToken, gistId } = settings;
    this.github = new Octokit({
      auth: `token ${gitHubToken}`,
    });
    this.gistId = gistId;
    this.GIST_EMPTY = GIST_EMPTY;
  }

  async getUser() {
    try {
      this.user = await this.github.users.getAuthenticated({});
      return this.user;
    } catch (err) {
      console.error(err);
    }
  }

  async initGist(publicFlg) {
    if (publicFlg) {
      this.GIST_EMPTY.public = true;
    }
    const spinner = ora(`Creating Gist...`).start();
    try {
      const res = await this.github.gists.create(this.GIST_EMPTY);
      if (res.data && res.data.id) {
        spinner.succeed();
        return res.data.id.toString();
      } else {
        throw Error('Git Creation Failed!');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async readGist(gistId = this.gistId) {
    const spinner = ora(`Loading Snippets From Gist...`).start();
    try {
      const res = await this.github.gists.get({ gist_id: gistId });
      spinner.succeed();
      return res;
    } catch (err) {
      if (String(err).includes("HttpError: Not Found")) {
        console.error('Invalid Gist ID!');
      }
      console.error(err);
    }
  }

  async uploadGist(gistObject) {
    const spinner = ora(`Uploading Snippets To Gist...`).start();
    try {
      gistObject.gist_id = this.gistId;
      const res = await this.github.gists.update(gistObject);
      spinner.succeed();
      return res;
    } catch (err) {
      if (String(err).includes("HttpError: Not Found")) {
        console.error('Invalid Gist ID!');
      }
      console.error(err);
    }
  }
}

module.exports = GitHubGist;
