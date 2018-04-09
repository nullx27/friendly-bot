'use strict';

const Module = require('../module');
const request = require('request');

class shouldi extends Module {

    trigger(){
        return "shouldi";
    }

    help(){
        return "Get a random yes or no" +
            "\n\n" +
            "Available commands:\n" +
            "!shouldi" +                   "\t\t\t\t\t " + "Gives random yes or no";
    }

    handle(message){
        let msg;
        let host = "https://yesno.wtf/api/";

        request(host, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body);
                msg = "```" + data.answer + "```" + "\n" + data.image;
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            message.channel.send(msg);
        });
    }
}

module.exports = function(bot) {
    new shouldi(bot);
};
