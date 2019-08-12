"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandHandler_1 = require("./handlers/CommandHandler");
const discord_js_1 = __importDefault(require("discord.js"));
const NotifyHandler_1 = require("./handlers/NotifyHandler");
const Scheduler_1 = require("./handlers/Scheduler");
const db_1 = require("./utils/db");
class FriendlyBot {
    constructor(logger) {
        this.logger = logger;
        this.token = process.env.DISCORD_TOKEN;
        this.client = new discord_js_1.default.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true,
            },
        });
        this.commandHandler = new CommandHandler_1.CommandHandler(this);
        this.notifyHandler = new NotifyHandler_1.NotifyHandler(this);
        this.scheduler = new Scheduler_1.Scheduler(this);
        this.db = new db_1.DB(this.logger);
    }
    registerEventHandlers() {
        this.client.once('ready', () => this.readyEvent.bind(this));
        this.client.on('disconnect', (event) => {
            this.logger.error(`Disconnected with close event: ${event.code}`);
        });
        this.client.on('error', error => this.logger.error(error));
        this.client.on('warn', warning => this.logger.warning(warning));
        this.client.on('message', message => this.commandHandler.handle(message));
    }
    readyEvent() {
        this.logger.info('Ready event received, starting normal operation.');
        setInterval(this.scheduler.run.bind(this.scheduler), 1000);
    }
    async run() {
        this.logger.info('Bot started');
        this.registerEventHandlers();
        this.commandHandler.load();
        this.notifyHandler.load();
        await this.client.login(this.token);
        this.logger.info('Successfully logged in');
    }
}
exports.FriendlyBot = FriendlyBot;
