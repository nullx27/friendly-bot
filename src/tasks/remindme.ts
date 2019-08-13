import {Task} from "../core/task/Task";
import {Message} from "../core/models/messages/Message";
import moment from "moment";
import {Container} from "../core/utils/Container";

export class RemindMeTask extends Task {

    async run(container: Container) {
        let storage = await container.get('db').pull('remindme');
        let remove = [];

        for (let i in storage) {
            if (moment(storage[i].time).diff(moment()) < 0) {
                await this.sendNotification(storage[i], container);
                remove.push(i);
            }
        }

        //clean up
        for (let index of remove.reverse()) {
            storage.splice(index, 1);
        }

        await container.get('db').set('remindme', storage)
    }

    async sendNotification(reminder: Reminder, container: Container) {
        let user = await container.get('discord').fetchUser(reminder.user);
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