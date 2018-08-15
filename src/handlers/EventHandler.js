'use strict';

class EventHandler {

    constructor(logger, bot) {
        this.logger = logger;
        this.bot = bot;
    }

    handle(event, callback) {
        callback(event, this.bot);
    }

}

module.exports = EventHandler;