import {createLogger, format, Logger, transports} from 'winston';
import {Container} from "./Container";

export const makeLogger = function (container: Container): Logger {
    const config = container.get('config');
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
            new transports.File({filename: config.LOG_PATH}),
        ],
    };

    if (config.ENV === 'debug') {
        logOptions.level = 'debug';
        // @ts-ignore
        logOptions.transports.push(new transports.Console())
    }

    return createLogger(logOptions);
}