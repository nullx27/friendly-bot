'use strict';

let autoload = require('auto-load');
let config = require('../config.json');

let Bot = require('./friendly-bot');
let modules = autoload(__dirname + '/modules');

let bot = new Bot(config);

for(let module in modules){
     modules[module](bot);
}

bot.run();
