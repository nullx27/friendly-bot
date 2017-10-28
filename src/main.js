'use strict';

let autoload = require('auto-load');
let config = require('../config.json');

var Bot = require('./friendly-bot');
var modules = autoload(__dirname + '/modules');

let bot = new Bot(config);

for(let module in modules){
     modules[module](bot);
}

bot.run();
