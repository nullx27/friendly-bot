'use strict';

const Module = require('../module');
const request = require('request');


class roll extends Module {
    trigger(){
        return "roll";
    }

    help(){
        return "Rolls a dice \n" +
        "Available commands:\n" +
        "!roll + maximum number of dice to roll.";
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    handle(message){
     var msg;
     var dice;
     var min = 1;

        //try block to catch exception if no command is given
        try {
            dice = message.content.substring(1).trim().slice(4).trim();
        }
        catch (e) {
            dice = "";
        }

        if (dice == "") {
            message.channel.sendMessage("You need to enter a dice to roll!");
        } else {
            var max = parseInt(dice);
            var roll = this.getRandomInt(min,max);
            msg = "```" + "You rolled " + roll + " on a D" + dice + "." + "```";
            message.channel.sendMessage(msg);
        }
    };
}

module.exports = function(bot) {
    new roll(bot);
};
