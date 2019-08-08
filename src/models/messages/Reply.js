'use strict';

const Discord = require('discord.js');

class Reply {
    constructor(origMessage) {
        this.dmsg = origMessage;
        this.embed = new Discord.RichEmbed();

        this.embed.setFooter(`Requested by ${origMessage.author.username}`, origMessage.author.avatarURL);
        this.embed.setTimestamp();
        this.embed.setColor('ORANGE');
    }

    setTitle(title) {
        this.embed.setTitle(title);
    }

    addField(name, value, inline=false) {
        this.embed.addField(name, value, inline);
    }

    getEmbed() {
        return this.embed;
    }

    send(message='') {
        this.dmsg.channel.send(message, this.embed);
    }
}

module.exports = Reply;