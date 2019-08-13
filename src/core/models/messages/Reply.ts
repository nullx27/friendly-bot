import Discord from 'discord.js'
import {Message} from './Message'

export class Reply extends Message {
    constructor(origMessage: Discord.Message) {
        super(origMessage.channel);
        this.embed = new Discord.RichEmbed();

        this.embed.setFooter(`Requested by ${origMessage.author.username}`, origMessage.author.avatarURL);
        this.embed.setTimestamp();
        this.embed.setColor('ORANGE');
    }
}