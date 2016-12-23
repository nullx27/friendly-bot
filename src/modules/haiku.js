'use strict';

const Module = require('../module');
const request = require('request');

class Haiku extends Module {
    trigger(){
        return "haiku";
    }

    help() {
        return "Get a inspireing haiku about a DAMN PATRIOT's sexual prowess" +
        "\n" +
        "Available commands:\n" +
        "!haiku";
    }

    handle(message){
        request('http://dropbearsanonymo.us/api/haiku', (error, response, body) => {
            var msg;
            if(!error && response.statusCode == 200) {
                var haiku = JSON.parse(body);

                msg = '```';
                msg += haiku.text;
                msg += '\r\r';
                msg += '-' + haiku.authorName;
                msg += '```';

            } else {
                msg = "Something went wrong. Best ping @Grimm#0928";
            }

            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new Haiku(bot);
};