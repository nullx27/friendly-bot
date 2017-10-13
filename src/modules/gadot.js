'use strict';

const Module = require('../module');
const request = require('request');

class Gadot extends Module {

    trigger(){
        return "gadot";
    }

    help(){
        return "Random Gal Gadot form imgur. \n" +
            "\n\n" +
            "Available commands:\n" +
            "!gadot \t Get a random Gal Gadot image";
    }

    restrictedChannel() {
        return false;
    }

    handle(message){
        request('https://imgur.com/r/GalGadot/hot.json', (error, response, body) => {

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
    new Gadot(bot);
};