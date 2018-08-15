'use strict';

const loader = require('../utils/loader');

class CommandHandler {
    constructor(logger, bot) {
        this.logger = logger;
        this.bot = bot;
        this.commands = [];
    }

    load() {
        this.commands = loader(__dirname + '/../commands', this.bot);
        console.log(this.commands);
        this.bot.logger.info(`${this.commands.length} Commands successfully loaded`);
    }

    handle(message) {

        this.commands.forEach(cmd => {

        });
    }
}

module.exports = CommandHandler;