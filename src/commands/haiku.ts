import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import Discord from 'discord.js';
import fs from "fs";
import {getRandomInt} from "../core/utils/Helpers";
import {Reply} from "../core/models/messages/Reply";
import {Container} from "../core/utils/Container";
import {Help} from "../core/models/messages/Help";

@trigger('haiku')
class Haiku extends Command {
    protected haikus: Haiku[] = [];

    constructor(container: Container) {
        super(container);
        const file = fs.readFileSync(__dirname + '/../../data/haiku.json', 'utf8');
        this.haikus = JSON.parse(file);
    }

    public help(): Help {
        return new Help()
            .addTitle('Haiku')
            .addDescription('Get an inspiring Haiku about the sexual prowess of the eternal god king of Dropbaers Anonymous')
            .addCommand('haiku', 'Get a random haiku')
            .addCommand('haiku <author>', 'Search for a random haiku of a specific author');
    }

    async handle(message: Discord.Message, args: string[]) {
        let haikus: any = [];

        if (args[0]) {
            for (let item of this.haikus) {
                if (item.author.toLowerCase().includes(args[0].toLowerCase())) {
                    haikus.push(item);
                }
            }
        }
        let haiku: any;

        if (haikus.length > 0) haiku = haikus[getRandomInt(0, haikus.length)];
        else haiku = this.haikus[getRandomInt(0, this.haikus.length)];

        new Reply(message)
            .setTitle('Haiku')
            .addField(haiku.author, haiku.text.replace(/^"+|"+$/g, ''), true).send();
    }
}

interface Haiku {
    author: string,
    text: string
}


module.exports = Haiku;