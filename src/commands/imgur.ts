import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import {SimpleReply} from '../core/models/messages/SimpleReply';
import Discord from 'discord.js';
import {imgurApiFetcher} from "../fetcher/Imgur";
import {getRandomInt} from "../core/utils/Helpers";
import {Reply} from "../core/models/messages/Reply";
import {Help} from "../core/models/messages/Help";

@trigger('natureislit', 'tinder', 'sos', 'redhead', 'instantregret', 'gif', 'gadot')
class Imgur extends Command {

    public help(trigger: string): Help {
        return new Help()
            .addTitle(trigger)
            .addDescription('Gets a random image from Imgur')
            .addCommand(trigger, 'Get a random image');
    }

    async handle(message: Discord.Message, args: string[], trigger: string) {
        let res: any;

        switch (trigger) {
            case 'natureislit':
                res = await imgurApiFetcher('NatureIsFuckingLit', 'hot');
                break;
            case 'tinder':
                res = await imgurApiFetcher('tinder', 'hot');
                break;
            case 'sos':
                res = await imgurApiFetcher('SwordOrSheath', 'hot');
                break;
            case 'redhead':
                res = await imgurApiFetcher('SFWRedheads', 'hot');
                break;
            case 'instantregret':
                res = await imgurApiFetcher('instantregret', 'hot');
                break;
            case 'gif':
                res = await imgurApiFetcher('gifs', 'hot');
                break;
            case 'gadot':
                res = await imgurApiFetcher('GalGadot', 'hot');
                break;
        }

        if (res === null) throw "Something went wrong, please try again!";

        const random: any = res.data[getRandomInt(0, res.data.length - 1)];

        const reply = new Reply(message).setTitle(random.title);
        reply.getEmbed()
            .setImage(`http://imgur.com/${random.hash}${random.ext.replace(/\?.*/, '')}`)
            .setURL(`http://imgur.com/${random.hash}`);

        reply.send();
    }
}

module.exports = Imgur;