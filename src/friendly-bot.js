'use strict';

const Discord = require('discord.js');
const moment = require('moment');

const CommandHandler = require('./handlers/CommandHandler');
const NotfiyHandler = require('./handlers/NotifyHandler');
const EventHandler = require('./handlers/EventHandler');
const eveOnlineStatus = require('./fetcher/EveOnlineStatus');

class FriendlyBot {
    constructor(logger) {
        this.logger = logger;

        this.token = process.env.DISCORD_TOKEN;

        this.discord = Discord;

        this.client = new Discord.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true
            }
        });

        this.commandHandler = new CommandHandler(logger, this);
        this.notifyHandler = new NotfiyHandler(logger, this.discord);
        this.eventHandler = new EventHandler(logger, this);

        this.bootstrapped = false;
    }

    registerEventHandlers() {
        this.client.on('ready', (event) => this.readyEvent(this));

        this.client.on('disconnect', (event) => {
            this.logger.error(`Disconnected with close event: ${event.code}`);
        });
        this.client.on('error', error => this.logger.error(error));
        this.client.on('warn', warning => this.logger.warning(warning));
    }

    readyEvent(self) {
        setInterval(self.updatePresence.bind(self), 3000);

        self.logger.info('Ready event received, starting normal operation.');
        self.bootstrapped = true;
    }

    async updatePresence() {
        const status = await eveOnlineStatus(this.logger);

        if (status !== null) {
            this.client.user.setPresence(
                {
                    status: 'online',
                    afk: false,
                    game: {
                        name: `you | Time: ${moment().utc().format("HH:mm")} EVE | Online ${status.players}`,
                        type: 'WATCHING',
                    },
                }
            );
        }
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

module.exports = FriendlyBot;