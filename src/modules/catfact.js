'use strict';

const Module = require('../module');
const request = require('request');

class catfact extends Module {

    trigger(){
        return "catfact";
    }

    help(){
        return "Get a random cat fact" +
            "\n\n" +
            "Available commands:\n" +
            "!catfact" +                   "\t\t\t\t\t " + "Gives random cat fact";
    }

    handle(message){
        let msg;
        let host = "https://catfact.ninja/fact";

        request(host, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body);
                msg = "```" + data.fact + "```";
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            message.channel.send(msg);
        });
    }
}

module.exports = function(bot) {
    new catfact(bot);
};
