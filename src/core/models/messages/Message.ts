import Discord, {DMChannel, GroupDMChannel, TextChannel} from "discord.js";
import {MessageInterface} from "../../contracts/MessageInterface";

export class Message implements MessageInterface {
    protected readonly channel: TextChannel | DMChannel | GroupDMChannel;
    protected embed: Discord.RichEmbed;

    constructor(channel: TextChannel | DMChannel | GroupDMChannel) {
        this.channel = channel;
        this.embed = new Discord.RichEmbed();
        this.embed.setColor('ORANGE');
    }

    setTitle(title: string): Message {
        this.embed.setTitle(title);

        return this;
    }

    setFooter(footer: string): Message {
        this.embed.setFooter(footer);

        return this;
    }

    addField(name: string, value: string, inline: boolean = false): Message {
        this.embed.addField(name, value, inline);

        return this;
    }

    getEmbed(): Discord.RichEmbed {
        return this.embed;
    }

    send(message: string = '') {
        this.channel.send(message, this.embed);
    }
}