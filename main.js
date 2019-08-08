'use strict'

require('dotenv').config()
const FriendlyBot = require('./src/friendly-bot')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
})

let logOptions = {
    level: 'info',
    'exitOnError': false,
    format: combine(
        timestamp(),
        logFormat,
    ),
    transports: [
        new transports.File({ filename: process.env.LOG_PATH }),
    ],
}

if (process.env.ENV === 'debug') {
    logOptions.level = 'debug'
    logOptions.transports.push(new transports.Console())
}

const logger = createLogger(logOptions)
const bot = new FriendlyBot(logger)

bot.run()