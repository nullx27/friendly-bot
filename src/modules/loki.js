'use strict';

const Module = require('../module');
const JsonDB = require('node-json-db');
const Discord = require('discord.js');

class loki extends Module {
    init() {
        this.db = new JsonDB(__dirname + "/loki/loki.json", true, false);
    }

    trigger() {
        return "loki";
    }

    help() {
        return "Get a loki quote" +
            "\n\n" +
            "Available commands:\n" +
            '!loki' +
            "\n" +
            '!loki <type> "link/text"' +
            "\n\n" +
            "Examples: \n" +
            '!loki link "https://i.imgur.com/pBB6xXy.jpg" \n' +
            '!loki text "LOKI \nGENERATED \nCONTENT"';
    }

    handle(message) {

        let msg = message.content.split(this.trigger())[1].trim();


        if (msg === "") {
            //Get random quote and display based on type
            var data = this.db.getData("/");

            //if no entry
            if (Object.keys(data).length <= 0) {
                message.channel.send("No quotes, Start adding them!");
                return;
            }

            //else calculate random index and take that index
            let itemArray = Object.entries(data);
            var item = itemArray[Math.floor(Math.random()*itemArray.length)];
            item = item[1];

            this.showMsg(message, item.type, item.value);
            return;
        }

        //check if " is present to not crash bot
        if (!msg.includes('"')) {
            message.channel.send("Could not parse your input. See !help loki for more info.")
            return;
        }


        let type = msg.split('"')[0].trim();
        let content = msg.split('"')[1].trim();

        if (type == null || content == null) {
            message.channel.send("Could not parse your input. See !help loki for more info.");
            return;
        } else if (type === "text" || type === "link") {
            //add to db
            this.saveMsg(message, type, content);
            message.channel.send("Saved to database");
            return;
        }

        //if gotten here we failed parsing type
        message.channel.send("Could not parse your type. Only 'text' and 'link' types are supported.");
    }

    saveMsg(message, type, value) {
        //make data and save in DB

        //replace newlines
        value = value.replace(/\\n/g, '-!-');

        let data = {
            type: type,
            value: value
        };
        this.db.push('/' + message.id, data);
    }

    showMsg(message, type, value) {
        //display message based on type
        const embed = new Discord.RichEmbed()
            .setColor(0xed6b21)
            .setFooter("Requested by " + message.author.username, message.author.avatarURL)
            .setTimestamp();
        switch(type) {
            case "link":
                embed.setImage(value);
                break;

            case "text":
                //replace newline
                value = value.replace("-!-", "\n");
                embed.addField("Loki Quotes", "```\n" + value + "```");
                break;

            default:
                break;
        }

        message.channel.send(embed);
    }
}

module.exports = function (bot) {
    new loki(bot);
};