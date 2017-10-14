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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    handle(message){
     var msg;
     var dice;
     var send = true;
     var min = 1;
     var max;

        //try block to catch exception if no command is given
        try {
            dice = message.content.substring(1).trim().slice(4).trim();
        }
        catch (e) {
            dice = "";
        }

        if (dice == "")
        {
            send = false;
            message.channel.sendMessage("You need to enter a dice to roll!");
        }
        if (send)
        {
            max = parseInt(dice);
            roll = getRandomInt(min,max);
            msg = "You rolled " + roll.toString() + " on a D" + dice + ".";
            message.channel.sendMessage("You need to enter a dice to roll!");
        }
    });
}
}
