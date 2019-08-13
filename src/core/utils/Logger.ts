import {createLogger, format, transports} from 'winston';
const {combine, timestamp, printf} = format;

let logOptions = {
    level: 'info',
    'exitOnError': false,
    format: combine(
        timestamp(),
        printf(({level: level, message: message, timestamp: timestamp}) => {
            return `${timestamp} ${level}: ${message}`;
        }),
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

export const logger = createLogger(logOptions);