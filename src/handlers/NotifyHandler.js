'use strict'

const loader = require('../utils/loader')

class NotifyHandler {

    constructor (logger, bot) {
        this.logger = logger
        this.bot = bot

        this.notificaitons = []
    }

    load () {
        this.notificaitons = loader(__dirname + '/../notifications', this.bot)
        this.logger.info(`${this.notificaitons.length} Notifiers loaded`)
        this.register();
    }

    register () {
        this.notificaitons.forEach(notification => {
            notification.handle()
        })
    }
}

module.exports = NotifyHandler