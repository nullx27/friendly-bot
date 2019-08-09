'use strict'

const Discord = require('discord.js')
const CommandHandler = require('./handlers/CommandHandler')
const NotifiyHandler = require('./handlers/NotifyHandler')
const Scheduler = require('./handlers/Scheduler')
const DB = require('./utils/db')

class FriendlyBot {
    constructor (logger) {
        this.logger = logger

        this.token = process.env.DISCORD_TOKEN
        this.client = new Discord.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true,
            },
        })

        this.commandHandler = new CommandHandler(logger, this)
        this.notifyHandler = new NotifiyHandler(logger, this)
        this.scheduler = new Scheduler()

        this.db = new DB(this.logger)

        this.bootstrapped = false
    }

    registerEventHandlers () {
        this.client.on('ready', (event) => this.readyEvent(this))

        this.client.on('disconnect', (event) => {
            this.logger.error(`Disconnected with close event: ${event.code}`)
        })
        this.client.on('error', error => this.logger.error(error))
        this.client.on('warn', warning => this.logger.warning(warning))

        this.client.on('message',
            message => this.commandHandler.handle(message))
    }

    readyEvent (self) {
        self.logger.info('Ready event received, starting normal operation.')
        self.bootstrapped = true
        setInterval(this.scheduler.run.bind(this.scheduler), 1000)

    }

    async run () {
        this.logger.info('Bot started')
        this.registerEventHandlers()

        await this.commandHandler.load()
        await this.notifyHandler.load()

        await this.client.login(this.token)
        this.logger.info('Successfully logged in')
    }
}

module.exports = FriendlyBot