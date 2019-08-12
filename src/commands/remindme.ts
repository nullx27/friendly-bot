import {Command, trigger} from "../models/Command";
import moment from "moment-timezone";
import chrono from "chrono-node";
import {Reply} from "../models/messages/Reply";
import {RemindMeTask, Reminder} from "../tasks/remindme";
import {FriendlyBot} from "../friendly-bot";
import Discord from 'discord.js';

@trigger('remindme')
class RemindMe extends Command {

    constructor(bot: FriendlyBot) {
        super(bot);
        this.bot.scheduler.addTask(new RemindMeTask(this.bot, 3000));
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

        let storage = await this.bot.db.pull('remindme');
        if (storage === null || !Array.isArray(storage)) storage = [];
        storage.push({time: time, msg: msg, user: message.author.id, created: moment()});

        await this.bot.db.set('remindme', storage);

        new Reply(message)
            .setTitle('Created a new Reminder')
            .addField('Time', moment(time).format('dddd, MMMM Do YYYY, HH:mm z'))
            .addField('Message', msg)
            .send();
    }
}

module.exports = RemindMe;