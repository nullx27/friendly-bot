'use strict';

class Command {
    constructor(bot) {
        this.bot = bot;
    }

    trigger() {
        return 'trigger';
    }

    async handle(message, args) {

    }
}

module.exports = Command;