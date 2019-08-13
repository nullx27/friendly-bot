import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import Discord from 'discord.js';
import fs from "fs";
import {getRandomInt} from "../core/utils/Helpers";
import {Reply} from "../core/models/messages/Reply";
import {Container} from "../core/utils/Container";

@trigger('haiku')
class Haiku extends Command {
    protected lines: Haiku[] = [];

    constructor(container: Container) {
        super(container);
        const file = fs.readFileSync(__dirname + '/../../data/haiku.json', 'utf8');
        this.lines = JSON.parse(file);
    }

    async handle(message: Discord.Message, args: string[]) {
        let line = this.lines[getRandomInt(0, this.lines.length - 1)];
        new Reply(message)
            .setTitle('Haiku')
            .addField(line.author, line.text.replace(/^"+|"+$/g, ''), true).send();
    }
}

interface Haiku {
    author: string,
    text: string
}


module.exports = Haiku;