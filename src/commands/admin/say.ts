import {AdminCommand} from "../../core/base/AdminCommand";
import Discord, {TextChannel} from 'discord.js';
import {trigger} from "../../core/utils/Decorators";

@trigger('say')
class Say extends AdminCommand {

    async handle(message: Discord.Message, args: string[]) {
        let str = args.join(' ');
        let regex = new RegExp(/(.+)\s\"(.+)\"/i);

        if (!regex.test(str)) throw 'Wrong Argument format!';

        let chunks = str.match(regex);
        if (chunks === null) throw 'Wrong Argument format!';

        regex = new RegExp(/<#(\d+)>/i);

        let channel: TextChannel;
        const client = this.container.get('discord');

        if (regex.test(chunks[1])) {
            // @ts-ignore
            channel = client.channels.get(chunks[1].match(regex)[1]);
        } else {
            // @ts-ignore
            channel = client.channels.find(x => x.name === chunks[1]);
        }

        if (!channel) throw 'Channel not found!';

        let msg = chunks[2].trim();
        await channel.send(msg);
    }
}

module.exports = Say;