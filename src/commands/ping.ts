import {Command, trigger} from '../models/Command';
import {SimpleReply} from '../models/messages/SimpleReply';
import Discord from 'discord.js';

@trigger('ping')
class Ping extends Command {
    async handle(message: Discord.Message, args: string[]) {
        new SimpleReply(message, 'pong').send();
    }
}

module.exports = Ping;