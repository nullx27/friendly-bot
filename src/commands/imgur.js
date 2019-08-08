'use strict'

const Command = require('../models/Command')
const Message = require('../models/messages/SimpleReply')

class Imgur extends Command {
    trigger () {
        return ['ping', 'pong']
    }

    handle (message, args) {
        let msg = new Message(message, 'pong')
        msg.send()
    }
}

module.exports = Imgur