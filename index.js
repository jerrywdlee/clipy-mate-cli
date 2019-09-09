const ClipyMate = require('clipy-mate-core');

const ReadLine = require('./lib/readline');

const clipy = new ClipyMate();
const readline = new ReadLine(clipy);

readline.updateSettings().then()

// console.log(clipy.opt);
