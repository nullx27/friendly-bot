'use strict'

const Command = require('../models/Command')

const moment = require('moment-timezone')
const chrono = require('chrono-node')
const Reply = require('../models/messages/Reply')
const RemindmeTask = require('../tasks/remindme');

class RemindMe extends Command {

    constructor(bot) {
        super(bot)
        this.bot.scheduler.addTask(new RemindmeTask(this.bot, 3000));
    }

    trigger () {
        return 'remindme'
    }

    async handle (message, args) {

        let str = args.join(' ')
        let regex = new RegExp(/(.+)\s\"(.+)\"/i)

        if (!regex.test(str)) {
            throw 'Wrong Argument format!'
        }

        let chunks = str.match(regex)
        let time = chunks[1].trim()
        let msg = chunks[2].trim()

        try {
            time = chrono.parseDate(time, moment())
        } catch (e) {
            throw "Could not parse date!"
        }

        let storage = await this.bot.db.pull('remindme')
        if (storage === null || !Array.isArray(storage)) storage = []
        storage.push({ time: time, msg: msg, user: message.author.id, created: moment() })
        await this.bot.db.set('remindme', storage)

        let reply = new Reply(message)
        reply.setTitle('Created a new Reminder')
        reply.addField('Time', moment(time).format('dddd, MMMM Do YYYY, HH:mm z'))
        reply.addField('Message', msg)
        reply.send()
    }
}

module.exports = RemindMe