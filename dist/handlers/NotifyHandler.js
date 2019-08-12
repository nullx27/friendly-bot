"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = __importDefault(require("../utils/loader"));
class NotifyHandler {
    constructor(bot) {
        this.bot = bot;
        this.notifications = [];
    }
    load() {
        this.notifications = loader_1.default(__dirname + '/../notifications', this.bot);
        this.bot.logger.info(`${this.notifications.length} Notifiers loaded`);
        this.handle();
    }
    async handle() {
        for (const notification of this.notifications) {
            await notification.handle();
        }
    }
}
exports.NotifyHandler = NotifyHandler;
