'use strict';

const Module = require('../module');

class Pong extends Module {
    trigger(){
        return "ping";
    }

    handle(message){
        message.channel.sendMessage('pong');
    }
}

module.exports = function(bot) {
    new Pong(bot);
};