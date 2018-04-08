'use strict';

const Module = require('../module');
const request = require('request');

class InstantRegret extends Module {

    trigger(){
        return "instantregret";
    }

    help(){
        return "Random instantregret from imgur. \n" +
            "\n\n" +
            "Available commands:\n" +
            "!instantregret \t Get a random instantregret";
    }

    restrictedChannel() {
        return false;
    }

    handle(message){
        request('https://imgur.com/r/instantregret/hot.json', (error, response, body) => {

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
    new InstantRegret(bot);
};