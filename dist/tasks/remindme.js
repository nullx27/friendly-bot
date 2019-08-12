"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("../models/Task");
const Message_1 = require("../models/messages/Message");
const moment_1 = __importDefault(require("moment"));
class RemindMeTask extends Task_1.Task {
    async run() {
        let storage = await this.bot.db.pull('remindme');
        let remove = [];
        for (let i in storage) {
            if (moment_1.default(storage[i].time).diff(moment_1.default()) < 0) {
                await this.sendNotification(storage[i]);
                remove.push(i);
            }
        }
        //clean up
        for (let index of remove.reverse()) {
            storage.splice(index, 1);
        }
        await this.bot.db.set('remindme', storage);
    }
    async sendNotification(reminder) {
        let user = await this.bot.client.fetchUser(reminder.user);
        let dmchannel = await user.createDM();
        new Message_1.Message(dmchannel)
            .addField('Reminder', reminder.msg)
            .setFooter('Reminder set at ' + moment_1.default(reminder.created).format('YYYY-MM-DD HH:mm'))
            .send();
    }
}
exports.RemindMeTask = RemindMeTask;
