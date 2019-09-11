'use strict';

const path = require('path');


const Realm = require('realm');

module.exports = async function (params) {
  console.log('Run teardown.js');
  // console.log(params)

  process.chdir(path.join(__dirname, '.'));
  // delete test Realm db
  Realm.deleteFile({});
};
