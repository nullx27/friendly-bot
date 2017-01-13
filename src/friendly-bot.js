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
        return this.client.users.find('username', name);
    }
}

module.exports = FriendlyBot;