'use strict';

class NotifyHandler {

    constructor(logger, discord) {
        this.logger = logger;
        this.discord = discord;
    }

    load() {
        this.logger.info('Notifiers successfully loaded');
    }
}

module.exports = NotifyHandler;