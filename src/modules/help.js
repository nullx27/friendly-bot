'use strict';

const Module = require('../module');
const request = require('request');


class Help extends Module {

    trigger(){
        return "help";
    }

    handle(message){
        let name = false;
        let modules = this.bot.getModules();
        let msg = "```";

        try {
            name = message.content.substring(1).split(' ')[1].trim();
        }
        catch (e) {
            name = false;
        }

        if(!name) {
            msg += 'Available commands: \n';

            for(let key in modules) {
                if(modules[key].trigger() !== '')
                    msg += modules[key].trigger() + '\n';
            }

            msg += '\n';
            msg += 'For more information use !help <command>'
        } else {
            for(let key in modules){
                if(modules[key].trigger() == name){
                    msg += modules[key].help();
                    break;
                }
            }
        }

        msg += "```";

        message.channel.send(msg);
    }
}

module.exports = function(bot) {
    new Help(bot);
};