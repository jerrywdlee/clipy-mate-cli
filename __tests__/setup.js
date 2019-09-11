'use strict';

const path = require('path');
const Realm = require('realm');
const ClipyMate = require('clipy-mate-core');
const schema = require('./schema.js');

module.exports = async function (params) {
  console.log('Running setup.js');
  // console.log(params);

  process.chdir(path.join(__dirname, '.'));
  const clipy = new ClipyMate();
  clipy.realm = await Realm.open({ schema: Object.values(schema), schemaVersion: 7 });
  // console.log(clipy.realm.schemaVersion);
  clipy.disconnect();
};
