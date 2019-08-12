import {Task} from "../models/Task";
import {Message} from "../models/messages/Message";
import moment from "moment";

export class RemindMeTask extends Task {

    async run() {
        let storage = await this.bot.db.pull('remindme');
        let remove = [];

        for (let i in storage) {
            if (moment(storage[i].time).diff(moment()) < 0) {
                await this.sendNotification(storage[i]);
                remove.push(i);
            }
        }

        //clean up
        for (let index of remove.reverse()) {
            storage.splice(index, 1);
        }

        await this.bot.db.set('remindme', storage)
    }

    async sendNotification(reminder: Reminder) {
        let user = await this.bot.client.fetchUser(reminder.user);
        let dmchannel = await user.createDM();

        new Message(dmchannel)
            .addField('Reminder', reminder.msg)
            .setFooter('Reminder set at ' + moment(reminder.created).format('YYYY-MM-DD HH:mm'))
            .send()
    }

}

export interface Reminder {
    time: Date;
    user: string;
    msg: string;
    created: number
}