'use strict';

const path = require('path');
const fs = require('fs');
const Realm = require('realm');

module.exports = async function (params) {
  console.log('Running teardown.js');
  // console.log(params)

  process.chdir(path.join(__dirname, '.'));
  // delete test Realm db
  Realm.deleteFile({});

  try {
    fs.unlinkSync(path.join(__dirname, '/.clipy-mate-cli/settings.json'));
    fs.rmdirSync(path.join(__dirname, '/.clipy-mate-cli'));
  } catch (err) {
    console.error(err);
  }
};
