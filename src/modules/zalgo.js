'use strict';

const Module = require('../module');
const request = require('request');

var maxRandom = 0;
var zalgo_up = [
    '\u030d', /*     ̍     */		'\u030e', /*     ̎     */		'\u0304', /*     ̄     */		'\u0305', /*     ̅     */
    '\u033f', /*     ̿     */		'\u0311', /*     ̑     */		'\u0306', /*     ̆     */		'\u0310', /*     ̐     */
    '\u0352', /*     ͒     */		'\u0357', /*     ͗     */		'\u0351', /*     ͑     */		'\u0307', /*     ̇     */
    '\u0308', /*     ̈     */		'\u030a', /*     ̊     */		'\u0342', /*     ͂     */		'\u0343', /*     ̓     */
    '\u0344', /*     ̈́     */		'\u034a', /*     ͊     */		'\u034b', /*     ͋     */		'\u034c', /*     ͌     */
    '\u0303', /*     ̃     */		'\u0302', /*     ̂     */		'\u030c', /*     ̌     */		'\u0350', /*     ͐     */
    '\u0300', /*     ̀     */		'\u0301', /*     ́     */		'\u030b', /*     ̋     */		'\u030f', /*     ̏     */
    '\u0312', /*     ̒     */		'\u0313', /*     ̓     */		'\u0314', /*     ̔     */		'\u033d', /*     ̽     */
    '\u0309', /*     ̉     */		'\u0363', /*     ͣ     */		'\u0364', /*     ͤ     */		'\u0365', /*     ͥ     */
    '\u0366', /*     ͦ     */		'\u0367', /*     ͧ     */		'\u0368', /*     ͨ     */		'\u0369', /*     ͩ     */
    '\u036a', /*     ͪ     */		'\u036b', /*     ͫ     */		'\u036c', /*     ͬ     */		'\u036d', /*     ͭ     */
    '\u036e', /*     ͮ     */		'\u036f', /*     ͯ     */		'\u033e', /*     ̾     */		'\u035b', /*     ͛     */
    '\u0346', /*     ͆     */		'\u031a' /*     ̚     */
];

//those go DOWN
var zalgo_down = [
    '\u0316', /*     ̖     */		'\u0317', /*     ̗     */		'\u0318', /*     ̘     */		'\u0319', /*     ̙     */
    '\u031c', /*     ̜     */		'\u031d', /*     ̝     */		'\u031e', /*     ̞     */		'\u031f', /*     ̟     */
    '\u0320', /*     ̠     */		'\u0324', /*     ̤     */		'\u0325', /*     ̥     */		'\u0326', /*     ̦     */
    '\u0329', /*     ̩     */		'\u032a', /*     ̪     */		'\u032b', /*     ̫     */		'\u032c', /*     ̬     */
    '\u032d', /*     ̭     */		'\u032e', /*     ̮     */		'\u032f', /*     ̯     */		'\u0330', /*     ̰     */
    '\u0331', /*     ̱     */		'\u0332', /*     ̲     */		'\u0333', /*     ̳     */		'\u0339', /*     ̹     */
    '\u033a', /*     ̺     */		'\u033b', /*     ̻     */		'\u033c', /*     ̼     */		'\u0345', /*     ͅ     */
    '\u0347', /*     ͇     */		'\u0348', /*     ͈     */		'\u0349', /*     ͉     */		'\u034d', /*     ͍     */
    '\u034e', /*     ͎     */		'\u0353', /*     ͓     */		'\u0354', /*     ͔     */		'\u0355', /*     ͕     */
    '\u0356', /*     ͖     */		'\u0359', /*     ͙     */		'\u035a', /*     ͚     */		'\u0323' /*     ̣     */
];

//those always stay in the middle
var zalgo_mid = [
    '\u0315', /*     ̕     */		'\u031b', /*     ̛     */		'\u0340', /*     ̀     */		'\u0341', /*     ́     */
    '\u0358', /*     ͘     */		'\u0321', /*     ̡     */		'\u0322', /*     ̢     */		'\u0327', /*     ̧     */
    '\u0328', /*     ̨     */		'\u0334', /*     ̴     */		'\u0335', /*     ̵     */		'\u0336', /*     ̶     */
    '\u034f', /*     ͏     */		'\u035c', /*     ͜     */		'\u035d', /*     ͝     */		'\u035e', /*     ͞     */
    '\u035f', /*     ͟     */		'\u0360', /*     ͠     */		'\u0362', /*     ͢     */		'\u0338', /*     ̸     */
    '\u0337', /*     ̷     */		'\u0361', /*     ͡     */		'\u0489' /*     ҉_     */
];

class zalgo extends Module {
    trigger(){
        return "zalgo";
    }

    help(){
        return "Converts text to Zalgo text." + "\n\n" + "!zalgo < text >";
    }

    handle(message){
        var msg;
        var text;
        msg="";

        //try block to catch exception if no command is given
        try {
            text = message.content.substring(1).trim().slice(5).trim();
        }
        catch (e) {
            text = "";
        }

        if (text == "")
        {
            message.channel.send("You need to enter something to convert, you dumbass!");
        }
        else
        {
            for (var i = 0, len = text.length; i < len; i++)
            {
                if(this.is_zalgo_char(text.substr(i, 1)))
                    continue;

                var num_up;
                var num_mid;
                var num_down;

                //add the normal character
                msg += text.substr(i, 1);

                num_up = this.rand(64) / 4 + 3;
                num_mid = this.rand(16) / 4 + 1;
                num_down = this.rand(64) / 4 + 3;

                for(var j=0; j<num_up; j++)
                    msg += this.rand_zalgo(zalgo_up);

                for(var j=0; j<num_mid; j++)
                    msg += this.rand_zalgo(zalgo_mid);

                for(var j=0; j<num_down; j++)
                    msg += this.rand_zalgo(zalgo_down);
            }
            message.channel.send(msg);
        }

    }

    is_zalgo_char(c){
        var i;
        for(i=0; i<zalgo_up.length; i++)
            if(c == zalgo_up[i])
                return true;
        for(i=0; i<zalgo_down.length; i++)
            if(c == zalgo_down[i])
                return true;
        for(i=0; i<zalgo_mid.length; i++)
            if(c == zalgo_mid[i])
                return true;
        return false;
    }

    //gets an int between 0 and max
    rand(max){
        return Math.floor(Math.random() * max);
    }

    //gets a random char from a zalgo char table
    rand_zalgo(array)
    {
        var ind = Math.floor(Math.random() * array.length);
        return array[ind];
    }
}

module.exports = function(bot) {
    new zalgo(bot);
};