'use strict';

const Module = require('../module');
const request = require('request');

class dog extends Module {

    trigger(){
        return "dog";
    }

    help(){
        return "Get a random dog from random.dog" +
            "\n\n" +
            "Available commands:\n" +
            "!dog" +                   "\t\t\t\t\t " + "Gives random dog";
    }

    handle(message){
        var msg;
        var host = "https://random.dog/woof.json";

        request(host, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                msg = data.url;
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new dog(bot);
};