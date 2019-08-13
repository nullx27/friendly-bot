import {CommandHandler} from "./handlers/CommandHandler";
import Discord from "discord.js";
import {NotificationHandler} from "./handlers/NotificationHandler";
import {Scheduler} from "./task/Scheduler";
import {DB} from "./utils/db";
import {Container} from "./utils/Container";
import {Logger} from "winston";
import {makeLogger} from "./utils/Logger";

export class FriendlyBot {

    private commandHandler: CommandHandler;
    private notifyHandler: NotificationHandler;
    private readonly token: string | undefined;
    private readonly client: Discord.Client;
    private readonly container: Container;
    private bootstrapped: boolean = false;

    constructor(container: Container) {
        this.container = container;
        this.container.register<Logger>('logger', makeLogger(container));
        this.token = container.get('config').DISCORD_TOKEN;

        this.client = new Discord.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true,
            },
        });

        this.container.register<Discord.Client>('discord', this.client);
        this.container.register<Scheduler>('scheduler', new Scheduler(container));
        this.container.register<DB>('db', new DB(container));

        this.commandHandler = new CommandHandler(container);
        this.notifyHandler = new NotificationHandler(container);

        this.registerEventHandlers();
    }

    private registerEventHandlers() {
        this.client.once('ready', () => this.readyEvent());
        this.client.on('disconnect', (event) => {
            this.container.get('logger').error(`Disconnected with close event: ${event.code}`)
        });
        this.client.on('error', error => this.container.get('logger').error(error));
        this.client.on('warn', warning => this.container.get('logger').warning(warning));

        this.client.on('message', message => this.commandHandler.handle(message));
    }

    readyEvent() {
        if (this.bootstrapped) return;
        this.container.get('logger').info('Ready event received, starting normal operation.');

        this.commandHandler.load();
        this.notifyHandler.load();
        this.setupScheduler();
        this.bootstrapped = true;
    }

    private setupScheduler() {
        const scheduler = this.container.get('scheduler');
        setInterval(scheduler.run.bind(scheduler), 1000);
    }

    async run() {
        this.container.get('logger').info('Bot started');
        await this.client.login(this.token);
        this.container.get('logger').info('Successfully logged in')
    }
}