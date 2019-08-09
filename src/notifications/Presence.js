'use strict'

const Notification = require('../models/Notification')

class Presence extends Notification {
    constructor (bot) {
        super(bot)
        this.bot = bot
        this.provider = process.env.PRESENCE_PROVIDER
        this.interval = process.env.PRESENCE_UPDATE_INTERVAL
    }

    async handle () {
        if (!this.provider) {
            this.bot.logger.info('No Presence Provider set. Skipping...')
            return
        }

        this.bot.logger.info('Using Precense Provider: ' + this.provider)
        const provider = require(`../tasks/presence/${this.provider}`)
        this.bot.scheduler.addTask(new provider(this.bot, this.interval))
    }
}

module.exports = Presence