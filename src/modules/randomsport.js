'use strict';

const Module = require('../module');
const request = require('request');

class RandomSport extends Module {

    trigger(){
        return "randomsport";
    }

    help(){
        return "Random sports from The Ocho. \n" +
            "\n\n" +
            "Available commands:\n" +
            "!randomsport \t Get a random sport";
    }

    restrictedChannel() {
        return false;
    }

    handle(message){
        request('https://imgur.com/r/TheOcho/hot.json', (error, response, body) => {

            if(!error && response.statusCode == 200) {
                var msg;
                var data = JSON.parse(body)['data'];

                var object = data[Math.floor(Math.random()*data.length)];

                msg = "```" + object.title + "```" + "\n" + `http://imgur.com/${object.hash}${object.ext.replace(/\?.*/, '')}`;

            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }

            message.channel.send(msg);
        });
    }
}

module.exports = function(bot) {
    new RandomSport(bot);
};