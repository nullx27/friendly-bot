'use strict';

const Module = require('../module');
const request = require('request');

class BetterLoop extends Module {

    trigger(){
        return "betterloop";
    }

    help(){
        return "Random bettereveryloop from imgur. \n" +
            "\n\n" +
            "Available commands:\n" +
            "!betterloop \t Get a random better every loop";
    }

    restrictedChannel() {
        return false;
    }

    handle(message){
        request('https://imgur.com/r/BetterEveryLoop/hot.json', (error, response, body) => {

            if(!error && response.statusCode == 200) {
                var msg;
                var data = JSON.parse(body)['data'];

                var object = data[Math.floor(Math.random()*data.length)];

                msg = "```" + object.title + "```" + "\n" + `http://imgur.com/${object.hash}${object.ext.replace(/\?.*/, '')}`;

            } else {
                msg = "Something went wrong. Try again or ping @Crow LightBringer#7621";
            }

            message.channel.send(msg);
        });
    }
}

module.exports = function(bot) {
    new BetterLoop(bot);
};