import {Command} from "../core/base/Command";
import {SimpleReply} from "../core/models/messages/SimpleReply";
import {Help} from "../core/models/messages/Help";
import {YouTube} from "../fetcher/YouTube";
import Discord from 'discord.js';
import {trigger} from "../core/utils/Decorators";

@trigger('youtube', 'y')
class Youtube extends Command {
    help(trigger: string): Help {
        return new Help()
            .addTitle('Youtube')
            .addDescription('Post a link for a Video on youtube matching your search term')
            .addCommand(trigger + ' <search>', 'Search for a youtube video');
    }

    async handle(message: Discord.Message, args: string[]) {
        if (args.length === 0) throw 'Argument Missing!';

        let data = await YouTube(args.join(' '));

        if (data == null || data.items[0].id.videoId == null) {
            new SimpleReply(message, 'No video found for that input!').send();
            return
        }

        new SimpleReply(message, `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`).send();
    }
}

module.exports = Youtube;