'use strict';

const Command = require('../models/Command');
const Message = require('../models/messages/SimpleReply');


class Ping extends Command {
    trigger() {
        return ['ping', 'pong'];
    }

    handle(message, args) {
        let msg = new Message(message, 'pong');
        msg.send();
    }
}

module.exports = Ping;