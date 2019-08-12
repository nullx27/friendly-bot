import {CommandHandler} from "./handlers/CommandHandler";
import Discord from "discord.js";
import {NotifyHandler} from "./handlers/NotifyHandler";
import {Scheduler} from "./handlers/Scheduler";
import {DB} from "./utils/db";
import {Logger} from "winston";

export class FriendlyBot {
    public logger: Logger;
    public db: DB;

    public readonly scheduler: Scheduler;
    public readonly client: Discord.Client;

    private commandHandler: CommandHandler;
    private notifyHandler: NotifyHandler;

    private readonly token: string | undefined;

    constructor(logger: Logger) {
        this.logger = logger;

        this.token = process.env.DISCORD_TOKEN;
        this.client = new Discord.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true,
            },
        });

        this.commandHandler = new CommandHandler(this);
        this.notifyHandler = new NotifyHandler(this);
        this.scheduler = new Scheduler(this);
        this.db = new DB(this.logger)
    }

    registerEventHandlers() {
        this.client.once('ready', () => this.readyEvent.bind(this));
        this.client.on('disconnect', (event) => {
            this.logger.error(`Disconnected with close event: ${event.code}`)
        });
        this.client.on('error', error => this.logger.error(error));
        this.client.on('warn', warning => this.logger.warning(warning));

        this.client.on('message',
            message => this.commandHandler.handle(message))
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
        this.logger.info('Successfully logged in')
    }
}