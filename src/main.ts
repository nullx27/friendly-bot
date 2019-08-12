require('dotenv').config();
import {FriendlyBot} from './friendly-bot';
import {createLogger, format, transports} from 'winston';

const {combine, timestamp, printf} = format;

const logFormat = printf(({level: level, message: message, timestamp: timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

let logOptions = {
    level: 'info',
    'exitOnError': false,
    format: combine(
        timestamp(),
        logFormat,
    ),
    transports: [
        new transports.File({filename: process.env.LOG_PATH}),
    ],
};

if (process.env.ENV === 'debug') {
    logOptions.level = 'debug';
    // @ts-ignore
    logOptions.transports.push(new transports.Console())
}

const logger = createLogger(logOptions);
let bot: FriendlyBot = new FriendlyBot(logger);
bot.run();