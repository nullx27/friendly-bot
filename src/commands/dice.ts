import {Command} from "../core/base/Command";
import {Reply} from "../core/models/messages/Reply";
import {Help} from "../core/models/messages/Help";
import {trigger} from "../core/utils/Decorators";
import Discord from 'discord.js';

@trigger('dice', 'roll', 'd')
class Dice extends Command {
    help() {
        return new Help()
            .addTitle('Dice')
            .addDescription('Roll a dice')
            .addCommand('![dice, roll, d] <input>', 'Roll a dice, takes a dice string like 1d6 or 2d10');
    }

    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    async handle(message: Discord.Message, args: string[]) {
        if (args.length === 0) throw 'Missing Arguments';

        const regex = new RegExp(/(\d+)?d(\d+)([\+\-]\d+)?/i);

        if (!regex.test(args[0])) throw 'Wrong Argument Format';

        let chunks = args[0].match(regex);
        if (chunks === null) throw 'Wrong Argument Format';
        let num: number = parseInt(chunks[0]);
        let dice: number = parseInt(chunks[1]);

        let reply = new Reply(message).setTitle(`Rolled ${args[0]} Dice`);

        for (let i = 0; i < num; i++) {
            reply.addField(`Dice ${i + 1}`, this.getRandomInt(1, dice).toString());
        }

        reply.send();
    }
}

module.exports = Dice;