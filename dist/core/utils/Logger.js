"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
exports.makeLogger = function (container) {
    var config = container.get('config');
    var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf;
    var logOptions = {
        level: 'info',
        'exitOnError': false,
        format: combine(timestamp(), printf(function (_a) {
            var level = _a.level, message = _a.message, timestamp = _a.timestamp;
            return timestamp + " " + level + ": " + message;
        })),
        transports: [
            new winston_1.transports.File({ filename: config.LOG_PATH }),
        ],
    };
    if (config.ENV === 'debug') {
        logOptions.level = 'debug';
        // @ts-ignore
        logOptions.transports.push(new winston_1.transports.Console());
    }
    return winston_1.createLogger(logOptions);
};
