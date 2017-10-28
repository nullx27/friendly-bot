'use strict';

const Module = require('../module');
const request = require('request');

class cat extends Module {

    trigger(){
        return "cat";
    }

    help(){
        return "Get a random cat from random.cat" +
            "\n\n" +
            "Available commands:\n" +
            "!cat" +                   "\t\t\t\t\t " + "Gives random cat";
    }

    handle(message){
        var msg;
        var host = "http://random.cat/meow";

        request(host, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                msg = data.file;
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            message.channel.send(msg);
        });
    }
}

module.exports = function(bot) {
    new cat(bot);
};