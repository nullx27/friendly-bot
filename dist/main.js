"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const friendly_bot_1 = require("./friendly-bot");
const winston_1 = require("winston");
const { combine, timestamp, printf } = winston_1.format;
const logFormat = printf(({ level: level, message: message, timestamp: timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
let logOptions = {
    level: 'info',
    'exitOnError': false,
    format: combine(timestamp(), logFormat),
    transports: [
        new winston_1.transports.File({ filename: process.env.LOG_PATH }),
    ],
};
if (process.env.ENV === 'debug') {
    logOptions.level = 'debug';
    // @ts-ignore
    logOptions.transports.push(new winston_1.transports.Console());
}
const logger = winston_1.createLogger(logOptions);
let bot = new friendly_bot_1.FriendlyBot(logger);
bot.run();
