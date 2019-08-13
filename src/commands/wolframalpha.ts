import {Command} from "../core/base/Command";
import {trigger} from "../core/utils/Decorators";
import {Help} from "../core/models/messages/Help";
import {wolframAlphaFetcher} from "../fetcher/WolframAlpha";
import {Reply} from "../core/models/messages/Reply";
import Discord from 'discord.js';

@trigger('calc')
class WolframAlpha extends Command {

    help() {
        return new Help()
            .addTitle('Wolfram Alpha')
            .addDescription('Calculates input though WolframAlpha')
            .addCommand('calc <input>', 'Gives result from calculation from Wolfram Alpha');
    }

    async handle(message: Discord.Message, args: string[]) {
        if (args.length === 0) throw 'Argument missing!';

        const data = await wolframAlphaFetcher(args[0]);
        let reply = new Reply(message);

        reply.getEmbed().setAuthor('Worlfram|Alpha', 'https://i.imgur.com/YVWvjlM.png');
        reply.getEmbed().setColor(0x00AE86);

        if (data === null) {
            reply.addField('Error', 'There was an error while trying to reach Wolfram Alpha, please try again later!')
                .send();
            return
        }

        if (!data.queryresult.success) {
            reply.addField('Error', 'Can\'t understand input!').send();
            return
        }

        for (let pod of data.queryresult.pods) {
            switch (pod.id) {
                case 'Input':
                case 'Result':
                    reply.addField(pod.title, pod.subpods[0].plaintext);
                    break;
                case 'Plot':
                    reply.getEmbed().setImage(pod.subpods[0].img.src);
                    break;
            }
        }

        reply.send()
    }
}

module.exports = WolframAlpha;