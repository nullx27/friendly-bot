'use strict';

const Module = require('../module');
const request = require('request');

class natureislit extends Module {

    trigger(){
        return "natureislit";
    }

    help(){
        return "Random lit image form r/NatureIsFuckingLit. \n" +
            "\n\n" +
            "Available commands:\n" +
            "!natureislit \t Get a random lit image";
    }

    restrictedChannel() {
        return false;
    }

    handle(message){
        request('https://imgur.com/r/NatureIsFuckingLit/hot.json', (error, response, body) => {

            if(!error && response.statusCode == 200) {
                var msg;
                var data = JSON.parse(body)['data'];

                var image = data[Math.floor(Math.random()*data.length)];

                msg = `http://imgur.com/${image.hash}${image.ext.replace(/\?.*/, '')}`;

            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }

            message.channel.send(msg);
        });
    }
}

module.exports = function(bot) {
    new natureislit(bot);
};