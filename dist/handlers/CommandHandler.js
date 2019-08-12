"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = __importDefault(require("../utils/loader"));
const DelegateCommandHandler_1 = require("./DelegateCommandHandler");
class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = {};
        this.delegate = new DelegateCommandHandler_1.DelegateCommandHandler();
    }
    load() {
        let commands = loader_1.default(__dirname + '/../commands', this.bot);
        this.bot.logger.info(`${commands.length} commands successfully loaded`);
        for (const cmd of commands) {
            let trigger = cmd.trigger;
            if (!Array.isArray(trigger)) {
                trigger = [trigger];
            }
            for (const t of trigger) {
                this.commands[t] = cmd;
            }
        }
        this.bot.logger.info(`${Object.keys(this.commands).length} commands triggers registered`);
    }
    async handle(message) {
        await this.delegate.handle(message, this.commands);
    }
}
exports.CommandHandler = CommandHandler;
