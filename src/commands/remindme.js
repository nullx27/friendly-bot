'use strict'

const Command = require('../models/Command')
const Message = require('../models/messages/SimpleReply')
const task = require('../tasks/remindme')
const moment = require('moment');


class RemindMe extends Command {
    trigger () {
        return 'remindme'
    }

    handle (message, args) {
        this.bot.scheduler.addTask(new task(message.author, 'test', moment().add(10, 'seconds')))

        let msg = new Message(message, 'Ok')
        msg.send()
    }
}

module.exports = RemindMe