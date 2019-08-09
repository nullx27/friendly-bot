'use strict'

const Task = require('../models/Task')
const moment = require('moment')
const Message = require('../models/messages/Message')

class Remindme extends Task {

    async run () {
        let storage = await this.bot.db.pull('remindme')
        let remove = [];

        for (let i in storage) {
            if (moment(storage[i].time).diff(moment()) < 0) {
                await this.sendNotification(storage[i])
                remove.push(i);
            }
        }

        //clean up
        for(let index of remove.reverse()) {
            storage.splice(index, 1);
        }

        this.bot.db.set('remindme', storage)
    }

    async sendNotification (reminder) {
        let user = await this.bot.client.fetchUser(reminder.user)
        let dmchannel = await user.createDM()

        let message = new Message(dmchannel)
        message.addField('Reminder', reminder.msg)
        message.setFooter('Reminder set at ' + moment(reminder.created).format('YYYY-MM-DD HH:mm'))
        message.send()
    }

}

module.exports = Remindme