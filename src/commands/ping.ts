import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import {SimpleReply} from '../core/models/messages/SimpleReply';
import Discord from 'discord.js';

@trigger('ping')
class Ping extends Command {
    async handle(message: Discord.Message, args: string[]) {
        new SimpleReply(message, 'pong').send();
    }
}

module.exports = Ping;