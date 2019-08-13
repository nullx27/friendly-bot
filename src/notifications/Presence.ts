import {Notification} from "../core/base/Notification";
import {FriendlyBot} from "../core/FriendlyBot";

class Presence extends Notification {
    private readonly provider: string;
    private readonly interval: number;

    constructor(bot: FriendlyBot) {
        super(bot);
        // @ts-ignore
        this.provider = process.env.PRESENCE_PROVIDER;
        // @ts-ignore
        this.interval = parseInt(process.env.PRESENCE_UPDATE_INTERVAL);
    }

    async handle(): Promise<void> {
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