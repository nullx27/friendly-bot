'use strict';

var autoload = require('auto-load');
var config = require('../config.json');

var Bot = require('./friendly-bot');
var modules = autoload(__dirname + '/modules');

var bot = new Bot(config);

for(var module in modules){
     modules[module](bot);
}

bot.run();
