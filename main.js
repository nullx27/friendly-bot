'use strict';

require('dotenv').config();
const winston = require('winston');
const FriendlyBot = require('./src/friendly-bot');


let logOptions = {
    level: 'info',
    'exitOnError': false,
    transports: [
        new winston.transports.File({ filename: process.env.LOG_PATH })
    ]
};

if(process.env.ENV === 'debug') {
    logOptions.level = 'debug';
    logOptions.transports.push(new winston.transports.Console())
}

const logger = winston.createLogger(logOptions);
const bot = new FriendlyBot(logger);

bot.run();