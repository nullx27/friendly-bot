import {Command} from "../core/base/Command";
import {Reply} from "../core/models/messages/Reply";
import {Help} from "../core/models/messages/Help";
import {YouTube} from "../fetcher/YouTube";
import Discord from 'discord.js';
import {trigger} from "../core/utils/Decorators";

@trigger('youtube', 'y')
class Youtube extends Command {
    help() {
        return new Help()
            .addTitle('Youtube')
            .addDescription('Post a link for a Video on youtube matching your search term')
            .addCommand('[y, youtube] <search>', 'Search for a youtube video');
    }

    async handle(message: Discord.Message, args: string[]) {
        if (args.length === 0) throw 'Argument Missing!';

        let data = await YouTube(args.join(' '));
        let reply = new Reply(message).setTitle('YouTube');

        if (data == null || data.items[0].id.videoId == null) {
            reply.addField('Error', 'No video found for that input!').send();
            return
        }

        reply.send(`https://www.youtube.com/watch?v=${data.items[0].id.videoId}`);
    }
}

module.exports = Youtube;