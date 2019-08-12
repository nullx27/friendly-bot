import {HandlerInterface} from './HandlerInterface'
import {FriendlyBot} from '../friendly-bot'
import {Command} from "../models/Command";
import loader from "../utils/loader";
import {DelegateCommandHandler} from "./DelegateCommandHandler";
import Discord from 'discord.js';

export class CommandHandler implements HandlerInterface {
    private delegate: DelegateCommandHandler;
    private commands: { [id: string]: Command; };

    constructor(protected bot: FriendlyBot) {
        this.commands = {};
        this.delegate = new DelegateCommandHandler()
    }

    load() {
        let commands = loader(__dirname + '/../commands', this.bot);
        this.bot.logger.info(`${commands.length} commands successfully loaded`);

        for (const cmd of commands) {
            let trigger = cmd.trigger;
            if (!Array.isArray(trigger)) {
                trigger = [trigger]
            }

            for (const t of trigger) {
                this.commands[t] = cmd
            }
        }

        this.bot.logger.info(`${Object.keys(this.commands).length} commands triggers registered`)
    }

    async handle(message: Discord.Message) {
        await this.delegate.handle(message, this.commands)
    }
}