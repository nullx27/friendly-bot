import loader from '../utils/loader';
import {HandlerInterface} from "./HandlerInterface";
import {FriendlyBot} from "../friendly-bot";
import {Notification} from "../models/Notification";

export class NotifyHandler implements HandlerInterface {
    private readonly bot: FriendlyBot;
    private notifications: Notification[];

    constructor(bot: FriendlyBot) {
        this.bot = bot;
        this.notifications = [];
    }

    load(): void {
        this.notifications = loader(__dirname + '/../notifications', this.bot);
        this.bot.logger.info(`${this.notifications.length} Notifiers loaded`);
        this.handle();
    }

    async handle(): Promise<void> {
        for (const notification of this.notifications) {
            await notification.handle()
        }
    }
}