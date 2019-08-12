"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_1 = require("../models/Notification");
class Presence extends Notification_1.Notification {
    constructor(bot) {
        super(bot);
        // @ts-ignore
        this.provider = process.env.PRESENCE_PROVIDER;
        // @ts-ignore
        this.interval = parseInt(process.env.PRESENCE_UPDATE_INTERVAL);
    }
    async handle() {
        if (!this.provider) {
            this.bot.logger.info('No Presence Provider set. Skipping...');
            return;
        }
        this.bot.logger.info('Using Precense Provider: ' + this.provider);
        const provider = require(`../tasks/presence/${this.provider}`);
        this.bot.scheduler.addTask(new provider(this.bot, this.interval));
    }
}
module.exports = Presence;
