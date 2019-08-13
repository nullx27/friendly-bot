import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import {Reply} from '../core/models/messages/Reply';
import Discord from 'discord.js';
import {Container} from "../core/utils/Container";
import {xkcdFetcher} from "../fetcher/Xkcd";
import {Help} from "../core/models/messages/Help";
import {getRandomInt} from "../core/utils/Helpers";

@trigger('xkcd')
class Xkcd extends Command {
    private info: any;

    constructor(container: Container) {
        super(container);

        xkcdFetcher().then((info) => {
            this.info = info;
        });
    }

    public help(): Help {
        return new Help()
            .addTitle('xkcd')
            .addDescription('Get a xkcd comic!')
            .addCommand('xkcd', 'Get a random xkcd comic')
            .addCommand('xkcd lastest', 'Get the latest xkcd comic')
            .addCommand('xkcd <number>', `Get a specific xkcd comic (current number is ${this.info.num})`);
    }

    async handle(message: Discord.Message, args: string[]) {
        let info: any;

        if (args[0] && args[0] === 'latest') info = await xkcdFetcher();
        else if (args[0] && !isNaN(Number(args[0]))) info = await xkcdFetcher(args[0]);
        else if (args[0]) throw "Unknown Argument!";
        else info = await xkcdFetcher(getRandomInt(1, this.info.num).toString());

        const reply = new Reply(message).setTitle('XKCD ' + info.num).addField(info.safe_title, info.alt, true);
        reply.getEmbed().setImage(info.img).setURL(info.img);
        reply.send();
    }
}

module.exports = Xkcd;