'use strict';

const Module = require('../module');
const request = require('request');

var maxRandom = 0;
class xkcd extends Module {
    init() {
        //get max number of xkcds to auto update the random function
        request("http://xkcd.com/info.0.json", (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                maxRandom = data.num;
            }
        });
        return;
    }

    trigger(){
        return "xkcd";
    }

    handle(message){
        var msg;
        var select = "";

        //try block to catch exception if no command is given
        try {
            select = message.content.substring(1).split(' ')[1].trim();
        }
        catch (e) {
            select = "";
        }

        var host = "";
        //if message got !command number, use different api to get specific xkcd
        if (select != "" && !isNaN(select))
            host = `http://xkcd.com/${select}/info.0.json`;
        else if (select == "latest")
            host = "http://xkcd.com/info.0.json";
        else
        {
            //Random gets triggered no matter what you write as parameter aslong as it's not a number
            var minRandom = 1;
            var random = Math.floor(Math.random()*(maxRandom-minRandom+1)+minRandom);
            host = `http://xkcd.com/${random}/info.0.json`;
        }

        request(host, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                var img = data.img;
                var safeTitle = data.safe_title;
                var altTitle= data.alt;

                msg = "```" + safeTitle + " - " + altTitle + "```" + "\n" + img;

            } else if (response.statusCode == 404)
            {
                msg = "That specific xkcd doesn't exist. Please choose another! Remember to only use numbers"
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            message.channel.sendMessage(msg);
        });
    }
}

module.exports = function(bot) {
    new xkcd(bot);
};