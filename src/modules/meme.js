'use strict';

const Module = require('../module');
const request = require('request');

class meme extends Module {

    trigger(){
        return "meme";
    }

    help(){
        return "Random meme form r/meme. \n" +
            "\n\n" +
            "Available commands:\n" +
            "!meme \t Get a random meme";
    }

    restrictedChannel() {
        return false;
    }

    handle(message){
        request('https://imgur.com/r/meme/hot.json', (error, response, body) => {

            if(!error && response.statusCode == 200) {
                var msg;
                var data = JSON.parse(body)['data'];

                var meme = data[Math.floor(Math.random()*data.length)];

                msg = `http://imgur.com/${meme.hash}${meme.ext.replace(/\?.*/, '')}`;

            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }

            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new meme(bot);
};