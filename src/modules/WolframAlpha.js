'use strict';

const Module = require('../module');
const request = require('request');
const Discord = require('discord.js');

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

        if (input != "")
        {
            host = `https://api.wolframalpha.com/v2/query?input=${input}&output=JSON&appid=${api}`; //format=plaintext&

            request(host, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);

                    //start embed
                    const embed = new Discord.RichEmbed()
                        .setAuthor("Wolfram Alpha", "https://i.imgur.com/YVWvjlM.png")
                        .setColor(0x00AE86)
                        .setFooter("Requested by " + message.author.username, message.author.avatarURL)
                        .setTimestamp();

                    //check for success
                    if (!data.queryresult.success) {
                        msg = "Couldn't understand the input."
                    } else {
                        //Correct input, can parse output
                        var subAnswers = data.queryresult.pods;
                        //format message

                        //msg = "```";
                        for (let pod of subAnswers) {
                            if (pod.id == "Input" || pod.id == "Result") {
                                embed.addField(pod.title, "```" + pod.subpods[0].plaintext + "```");
                            }

                            //plot
                            if (pod.id == "Plot") {
                                //embed.addField(pod.title, "\t");
                                embed.setImage(pod.subpods[0].img.src);
                            }
                        }
                        //replace ? with =
                        //msg = msg.replace(/\uF7D9/g, "=");
                    }
                    //send embed
                    message.channel.send(embed);
                } else {
                    //error send error msg
                    msg = "Something went wrong. Best ping @Crow LightBringer#7621";
                    message.channel.send(msg);
                }
            });
        } else {
            msg = "You need to enter something to calculate, you dumbass!";
            message.channel.send(msg);
        }
    }
}

module.exports = function(bot) {
    new WolframAlpha(bot);
};