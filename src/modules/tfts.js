'use strict';

const Module = require('../module');
const request = require('request');
const Discord = require('discord.js');

var maxRandom = 0;
class tfts extends Module {

    trigger(){
        return "tfts";
    }

    help(){
        return "Get a hot story from r/TalesFromTechSupport subreddit \n" +
            "\n\n" +
            "Available commands:\n" +
            "!tfts \t Get a random story from TFTS";
    }

    handle(message){
        var msg;

        //loading msg
        var sentMsg = message.channel.send("Loading Post... Please wait you impatient fool!");

        var host = "https://www.reddit.com/r/talesfromtechsupport/random/.json?raw_json=1";
        request(host, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);

                //have amount of tries to find random post not stickied as we got posts.
                for (var i = 0; i < data.data.children.length; i++) {
                    //randomize posts
                    var rand = Math.floor(Math.random()*data.data.children.length);
                    var post = data.data.children[rand].data;

                    //don't go for stickied posts
                    if (!post.stickied ) {
                        var text = post.selftext.replace(/&gt;/g, ">").replace(/&lt;/g, "<"); //.replace(/\\([\s\S])|(")/g,"\\$1$2");
                        //got \u200b because \n doesn't work on first line unless a char is put first
                        msg = `\u200b \n **${post.title}** \n \`\`\` ${text} \`\`\` \n`;
                        break;
                    }
                }
            } else {
                msg = "Something went wrong. Best ping @Crow LightBringer#7621";
            }
            sentMsg.then(message => {message.delete(msg)});
            message.channel.send(msg, {split: {prepend: "```", append:"```"}});
        });
    }
}

module.exports = function(bot) {
    new tfts(bot);
};