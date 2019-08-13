import {Command} from '../core/base/Command';
import {trigger} from "../core/utils/Decorators";
import Discord from 'discord.js';
import fs from "fs";
import {getRandomInt} from "../core/utils/Helpers";
import {Reply} from "../core/models/messages/Reply";
import {Container} from "../core/utils/Container";
import {Help} from "../core/models/messages/Help";

@trigger('loki')
export class Loki extends Command {
    protected lines: string[] = [];

    public help(): Help {
        return new Help()
            .addTitle('Loki Quotes')
            .addCommand('logi', 'Get a Loki Sotken quote');
    }

    constructor(container: Container) {
        super(container);
        const file = fs.readFileSync(__dirname + '/../../data/loki.json', 'utf8');
        this.lines = JSON.parse(file);
    }

    async handle(message: Discord.Message, args: string[]) {
        let line = this.lines[getRandomInt(0, this.lines.length - 1)];
        new Reply(message).addField('Quote', line, true).send();
    }
}

module.exports = Loki;