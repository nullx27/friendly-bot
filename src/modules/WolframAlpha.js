'use strict';

const Module = require('../module');
const request = require('request');

class WolframAlpha extends Module {

    trigger(){
        return "calc";
    }

    help(){
        return "Calculates input though WolframAlpha" +
            "\n\n" +
            "Available commands:\n" +
            "!calc <input>" +                   "\t\t\t\t\t " + "Gives result from calculation from Wolfram Alpha";
    }

    handle(message){
        var msg = "";
        var input = "";
        var api = this.bot.config.wolframAlphaAPI;
        var host = "";
        var send = true;

        //try block to catch exception if no command is given
        try {
            input = message.content.substring(1).trim().slice(4).trim();
        }
        catch (e) {
            input = "";
        }

        if (input == "")
        {
            send = false;
            msg = "You need to enter something to calculate, you dumbass!";
        }

        if (send)
        {
            host = `https://api.wolframalpha.com/v2/query?input=${input}&format=plaintext&output=JSON&appid=${api}`;

            request(host, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);

                    //check for success
                    if (!data.success) {
                        msg = "Couldn't understand the input."
                    } else {
                        //Correct input, can parse output
                        var subAnswers = data.queryresult.pods;
                        //format message
                        //msg = "```";
                        for (let pod of subAnswers) {
                            if (pod.id == "Input" || pod.id == "Result") {
                                msg += "**" + pod.title + "**" + "\n";
                                msg += "```" + pod.subpods[0].plaintext + "```" + "\n";
                            }
                        }
                        //replace ? with =
                        msg = msg.replace(/\uF7D9/g, "=");
                    }

                } else {
                    msg = "Something went wrong. Best ping @Crow LightBringer#7621";
                }
                message.channel.sendMessage(msg);
            });
        } else {
            message.channel.sendMessage(msg);
        }
    }
}

module.exports = function(bot) {
    new WolframAlpha(bot);
};