'use strict';

const EventEmitter = require('events');
const Discord = require('discord.js');

class FriendlyBot extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;
        this.client = new Discord.Client();

        this.client.once('ready', this.register.bind(this));
    }

    register(){
        this.client.on('message', this.handleMessage.bind(this))
    }

    handleMessage(message){
        if(message.content.startsWith('!')) {
            var trigger = message.content.substring(1).split(' ')[0].trim();
            console.log('Trigger: ' + trigger + ' Msg: ' + message.content);
            this.emit('trigger:' + trigger, message);
        }
    }

    run(){

        this.client.login(this.config.discord_token);
    }
}

module.exports = FriendlyBot;