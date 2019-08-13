import {CommandHandler} from "./handlers/CommandHandler";
import Discord from "discord.js";
import {NotifyHandler} from "./handlers/NotifyHandler";
import {Scheduler} from "./task/Scheduler";
import {DB} from "./utils/db";
import {Container} from "./utils/Container";
import {Logger} from "winston";
import {logger} from "./utils/Logger";

export class FriendlyBot {
    
    private commandHandler: CommandHandler;
    private notifyHandler: NotifyHandler;
    private readonly token: string | undefined;
    private readonly client: Discord.Client;
    private readonly container: Container;

    constructor(container: Container) {
        this.container = container;
        this.container.register<Logger>('logger', logger);
        this.token = container.get('config').DISCORD_TOKEN;

        this.client = new Discord.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true,
            },
        });

        this.container.register<Discord.Client>('discord', this.client);
        this.container.register<Scheduler>('scheduler', new Scheduler(this.container));
        this.container.register<DB>('db', new DB(this.container));

        this.commandHandler = new CommandHandler(this);
        this.notifyHandler = new NotifyHandler(this);
    }

    registerEventHandlers() {
        this.client.once('ready', () => this.readyEvent.bind(this));
        this.client.on('disconnect', (event) => {
            this.container.get('logger').error(`Disconnected with close event: ${event.code}`)
        });
        this.client.on('error', error => this.container.get('logger').error(error));
        this.client.on('warn', warning => this.container.get('logger').warning(warning));

        this.client.on('message',
            message => this.commandHandler.handle(message))
    }

    readyEvent() {
        this.container.get('logger').info('Ready event received, starting normal operation.');
        setInterval(this.container.get('scheduler').run.bind(this.container), 1000);
    }

    async run() {
        this.container.get('logger').info('Bot started');
        this.registerEventHandlers();

        this.commandHandler.load();
        this.notifyHandler.load();

        await this.client.login(this.token);
        this.container.get('logger').info('Successfully logged in')
    }
}