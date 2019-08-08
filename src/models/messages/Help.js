'use strict';

const Discord = require('discord.js');

class Help {
    constructor() {
        this.msg = new Discord.RichEmbed();
        this.msg.setTimestamp();
    }

    addTitle(title) {
        this.msg.setTitle('Help: ' + title);
        return this;
    }

    addDescription(desc) {
        this.msg.addField('\u200B', desc, true);
        return this;
    }

    addCommand(cmd, desc) {
        this.msg.addField(cmd, desc);
        return this;
    }

    getMessage() {
        return this.msg;
    }
}

module.exports = Help;