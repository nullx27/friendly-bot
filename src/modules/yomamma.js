'use strict';

const Module = require('../module');
const request = require('request');

class YoMamma extends Module {

    trigger(){
        return "yomamma";
    }

    help(){
        return "Random yo mamma lines\n" +
            "\n\n" +
            "Available commands:\n" +
            "!yomamma \t Get a random yo mamma line";
    }

    restrictedChannel() {
        return true;
    }

    handle(message){
        request('http://api.yomomma.info/', (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var msg = JSON.parse(body)['joke'];
            } else {
                msg = "Something went wrong. Best ping @Agnostic_Mantis#4510";
            }

            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new YoMamma(bot);
};
