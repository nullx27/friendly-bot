'use strict';

const Module = require('../module');
const request = require('request');

class Chucknorris extends Module {

    trigger(){
        return "chucknorris";
    }

    help(){
        return "Random chuck norris facts\n" +
            "\n\n" +
            "Available commands:\n" +
            "!cucknorris \t Get a random chuck norris fact";
    }

    restrictedChannel() {
        return true;
    }

    handle(message){
        request('https://api.chucknorris.io/jokes/random', (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var msg = JSON.parse(body)['value'];
            } else {
                msg = "Something went wrong. Best ping @Jan#6422";
            }

            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new Chucknorris(bot);
};
