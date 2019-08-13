import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import {SimpleReply} from '../core/models/messages/SimpleReply';
import Discord from 'discord.js';
import {Help} from "../core/models/messages/Help";

@trigger('ping')
class Ping extends Command {
    public help(): Help {
        return new Help().addTitle('Ping')
            .addCommand('ping', 'Get a pong response from the bot');
    }

    async handle(message: Discord.Message, args: string[]) {
        new SimpleReply(message, 'pong').send();
    }
}

module.exports = Ping;