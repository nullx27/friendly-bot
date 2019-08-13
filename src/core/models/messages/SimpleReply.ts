import {MessageInterface} from "../../contracts/MessageInterface";
import Discord from 'discord.js';

export class SimpleReply implements MessageInterface {
    private reply: string;
    private dmsg: Discord.Message;

    constructor(originalMessage: Discord.Message, reply: string) {
        this.dmsg = originalMessage;
        this.reply = reply;
    }

    async send() {
        await this.dmsg.channel.send(this.reply, {});
    }
}