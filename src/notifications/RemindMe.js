'use strict'

const Notification = require('../models/Notification')
const RemindmeTask = require('../tasks/remindme');

class RemindMe extends Notification {

    async handle () {
        this.bot.scheduler.addTask(new RemindmeTask(this.bot, 3000));
    }
}

module.exports = RemindMe