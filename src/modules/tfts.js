'use strict';

const Module = require('../module');
const request = require('request');

var maxRandom = 0;
class tfts extends Module {

    trigger(){
        return "tfts";
    }

    help(){
        return "Get a hot story from r/TalesFromTechSupport subreddit";
    }

    handle(message){
        var msg;

        //loading msg
        var sentMsg = message.channel.sendMessage("Loading Post... Please wait you impatient fool!");

        var host = "https://www.reddit.com/r/talesfromtechsupport/random/.json?raw_json=1";
        request(host, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                var post = data[0].data.children[0].data;
                var text = post.selftext.replace(/&gt;/g, ">").replace(/&lt;/g, "<");

                msg = "```"
                        + "**" + post.title + "**"
                        + "\n\n"
                        + text + "```";
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            sentMsg.then(message => {message.edit(msg)});
        });
    }
}

module.exports = function(bot) {
    new tfts(bot);
};