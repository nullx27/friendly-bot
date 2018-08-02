'use strict';

const Module = require('../module');
const request = require('request');

class Haiku extends Module {
    trigger() {
        return "haiku";
    }

    help() {
        return "Get a inspireing haiku about a DAMN PATRIOT's sexual prowess" +
            "\n\n" +
            "Available commands:\n" +
            "!haiku";
    }

    handle(message) {

        let url = "https://auth.friendlyprobes.net/api/haiku?api_token=" + this.bot.config.asgard_api_token

        try {
            let input = message.content.substring(1).trim().slice(5).trim();
            input = encodeURI(input);
            url = `https://auth.friendlyprobes.net/api/haiku/${input}?api_token=` + this.bot.config.asgard_api_token
        }
        catch (e) {
        }

        request(url, (error, response, body) => {
            var msg;
            if (!error && response.statusCode == 200) {
                var haiku = JSON.parse(body);
                haiku = haiku.data;

                msg = '```';
                msg += haiku.text;
                msg += '\r\r';
                msg += '-' + haiku.author;
                msg += '```';

            } else if (response.statusCode == 404) {
                msg = 'No Haiku found';
            } else {
                msg = "Something went wrong. Best ping @Grimm#0928";
            }

            message.channel.send(msg);
        });
    }
}

module.exports = function (bot) {
    new Haiku(bot);
};
