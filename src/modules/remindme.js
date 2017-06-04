'use strict';

const Module = require('../module');
const moment = require('moment-timezone');
const dateparse = require('dateparser');
const JsonDB = require('node-json-db');

class Remindme extends Module {
    init() {
        this.db = new JsonDB("remindme", true, false);

        setInterval(this.check.bind(this), 20000);
    }

    check() {
        this.db.reload();
        let entries = this.db.getData('/');

        for (let id in entries) {
            if (moment().isAfter(entries[id].time)) {

                let msg = entries[id].msg;
                this.bot.getClient().fetchUser(entries[id].userid).then(user => {
                    user.sendMessage("Reminder: " + msg);
                });

                this.db.delete('/' + id);
            }
        }
    }

    trigger() {
        return "remindme";
    }

    help() {
        return "Remind me at a later time" +
            "\n\n" +
            "Available commands:\n" +
            '!remindme time "message"' +
            "\n\n" +
            "Examples: \n" +
            '!remindme 20 min "Clean the kitchen"';
    }

    handle(message) {

        let msg = message.content.split(this.trigger())[1].trim();

        let time = msg.split('"')[0].trim();
        let text = msg.split('"')[1].trim();

        let parsed = dateparse.parse(time);

        if (parsed == null) {
            message.reply("Could not parse your target time. See !help remindme for more infos.");
            return;
        }

        let data = {
            userid: message.author.id,
            time: moment().add(parsed.value, 'ms'),
            msg: text
        };

        this.db.push('/' + message.id, data);

        message.reply('Reminder set for ' + moment(data.time).format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }
}

module.exports = function (bot) {
    new Remindme(bot);
};