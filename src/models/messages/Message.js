'use strict';

const Discord = require('discord.js');

class Message {
    constructor(channel) {
        this.channel = channel;
        this.embed = new Discord.RichEmbed();
        this.embed.setColor('ORANGE');
    }

    setTitle(title) {
        this.embed.setTitle(title);
    }

    setFooter(footer) {
        this.embed.setFooter(footer);
    }

    addField(name, value, inline=false) {
        this.embed.addField(name, value, inline);
    }

    getEmbed() {
        return this.embed;
    }

    send(message='') {
        this.channel.send(message, this.embed);
    }
}

module.exports = Message;