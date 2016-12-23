'use strict';

const Module = require('../module');
const request = require('request');


class Redhead extends Module {
    trigger(){
        return "redhead";
    }

    help(){
        return "Random readhead form r/SFWRedheads. \n" +
            "\n" +
            "Available commands:\n" +
            "!redhead \t Get a random redhead";
    }

    handle(message){
        request('https://imgur.com/r/SFWRedheads/hot.json', (error, response, body) => {

            if(!error && response.statusCode == 200) {
                var msg;
                var data = JSON.parse(body)['data'];

                var redhead = data[Math.floor(Math.random()*data.length)];

                msg = `http://imgur.com/${redhead.hash}${redhead.ext.replace(/\?.*/, '')}`;

            } else {
                msg = "Something went wrong. Best ping @Grimm#0928";
            }

            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new Redhead(bot);
};