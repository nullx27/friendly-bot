'use strict';

const Module = require('../module');

class Pong extends Module {
    trigger(){
        return "ping";
    }

    help(){
        return "Ping/Pong command for this bot." +
            "\n\n" +
            "Available commands:\n" +
            "!ping \t Get a pong response from the bot";
    }

    handle(message){
        message.channel.send('pong');
    }
}

module.exports = function(bot) {
    new Pong(bot);
};