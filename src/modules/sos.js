'use strict';

const Module = require('../module');
const request = require('request');


class SoS extends Module {
    trigger(){
        return "sos";
    }

    help(){
        return "Sword or Sheath. You decide \n" +
            "\n\n" +
            "Available commands:\n" +
            "!sos \t Get a random image from r/SwordOrSheath";
    }

    handle(message){
        request('https://imgur.com/r/SwordOrSheath/hot.json', (error, response, body) => {

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
    new SoS(bot);
};