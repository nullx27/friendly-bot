import {Command} from "../core/base/Command";
import {trigger} from "../core/utils/Decorators";
import {Reply} from "../core/models/messages/Reply";
import {RemindMeTask} from "../tasks/remindme";
import Discord from 'discord.js';
import moment from "moment-timezone";
import chrono from "chrono-node";
import {Help} from "../core/models/messages/Help";

@trigger('remindme')
class RemindMe extends Command {

    init() {
        this.container.get('scheduler').addTask(new RemindMeTask(3000));
    }

    public help(): Help {
        return new Help()
            .addTitle('Remind Me')
            .addDescription('Let the bot remind you of something on a later date!')
            .addCommand('remindme <time> "<message>"', "Set a reminder for a specific time and let the bot remind you.")
            .addDescription('<time> can be a specific time (august 15th, 12am) or a relative time (tomorrow at 12am or 2 hours). The bot takes the current Time and Date as a reference. Should also work with Timezones')
            .addDescription('<message> is the message that you need to be reminded of (make sure to include the ")');
    }

    async handle(message: Discord.Message, args: string[]) {

        let str = args.join(' ');
        let regex = new RegExp(/(.+)\s\"(.+)\"/i);

        if (!regex.test(str)) throw 'Wrong Argument format!';

        let chunks = str.match(regex);
        if (chunks === null) throw 'Wrong Argument format!';

        let time_str = chunks[1].trim();
        let msg = chunks[2].trim();

        let time: Date;
        try {
            time = chrono.parseDate(time_str, moment().toDate())
        } catch (e) {
            throw "Could not parse date!"
        }

        let storage = await this.container.get('db').pull('remindme');
        if (storage === null || !Array.isArray(storage)) storage = [];
        storage.push({time: time, msg: msg, user: message.author.id, created: moment()});

        await this.container.get('db').set('remindme', storage);

        new Reply(message)
            .setTitle('Created a new Reminder')
            .addField('Time', moment(time).format('dddd, MMMM Do YYYY, HH:mm z'))
            .addField('Message', msg)
            .send();
    }
}

module.exports = RemindMe;