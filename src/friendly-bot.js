'use strict';

const EventEmitter = require('events');
const Discord = require('discord.js');

class FriendlyBot extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;
        this.modules = {};

        this.client = new Discord.Client();
        this.client.once('ready', this.ready.bind(this));
    }

    ready(){
        this.client.on('message', this.handleMessage.bind(this))
    }

    register(name, module){
        this.modules[name] = module;
    }

    getModules(){
        return this.modules;
    }

    handleMessage(message){
        if(message.content.startsWith('!')) {
            var trigger = message.content.substring(1).split(' ')[0].trim();

            //check if trigger is registered as restricted
            var restricted;
            let modules = this.getModules();
            let restrictedChannels = this.config.restricted_channel;

            for(let key in modules){
                if(modules[key].trigger() == trigger){
                    restricted = modules[key].restrictedChannel();
                    break;
                }
            }

            //if restricted is true and channel name match one of the channels in config, or if config is empty send msg, otherwise give error msg
            if(!restricted) {
                this.emit('trigger:' + trigger, message);
            }
            else if (restricted && restrictedChannels.indexOf(message.channel.name) >= 0) {
                this.emit('trigger:' + trigger, message);
            }
            else if (restrictedChannels.length == 0) {
                this.emit('trigger:' + trigger, message);
            }
            else {
                var msg = "This command are only allowed in the following channels:\n";
                msg += "```";
                for(let cIndex in restrictedChannels) {
                    msg += restrictedChannels[cIndex] + "\n";
                }
                msg += "```";

                message.channel.sendMessage(msg);
            }

            this.emit('trigger:' + trigger, message);
        }
    }

    run(){
        this.client.login(this.config.discord_token);
    }

    getClient(){
        return this.client;
    }

    getChannelByName(name) {
        return this.client.channels.find('name', name)
    }

    getUserByName(name) {
        var member;
        var guild = this.client.guilds.every(function(element){
            member = element.members.find('nickname', name);
        });
        if (member == null)
            return this.client.users.find('username', name);

        return member;
    }
}

module.exports = FriendlyBot;