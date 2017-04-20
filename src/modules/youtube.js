'use strict';

const Module = require('../module');
const request = require('request');

var maxRandom = 0;
class youtube extends Module {

    trigger(){
        return "youtube";
    }

    help(){
        return "Gets first result from youtube." + "\n\n" + "!youtube < search >";
    }

    handle(message){
        var msg;
        var search;
        var send = true;

        //try block to catch exception if no command is given
        try {
            search = message.content.substring(1).trim().slice(7).trim();
        }
        catch (e) {
            search = "";
        }

        if (search == "")
        {
            send = false;
            message.channel.sendMessage("You need to enter something to search for, you dumbass!");
        }



        var key = this.bot.config.youtubeAPI;

        var host = `https://content.googleapis.com/youtube/v3/search?part=snippet&q=${search}&safeSearch=moderate&key=${key}`;

        if (send)
        {
            request(host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    var data = JSON.parse(body);

                    if(data == null || data.items[0].id.videoId == null) {
                        msg = "Couldn't find any videos with that search term. Please try another search term.";
                    }
                    else {
                        var videolink = data.items[0].id.videoId;
                        msg = `https://www.youtube.com/watch?v=${videolink}`;
                    }
                } else {
                    msg = "Something went wrong. Best ping @Crow LightBringer#7621";
                }
                message.channel.sendMessage(msg);
            });
        }
    }
}

module.exports = function(bot) {
    new youtube(bot);
};