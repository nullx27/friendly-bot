import {HandlerInterface} from '../contracts/HandlerInterface'
import {Command} from "../base/Command";
import loader from "../utils/loader";
import {DelegateCommandHandler} from "./DelegateCommandHandler";
import Discord from 'discord.js';
import {Container} from "../utils/Container";

export class CommandHandler implements HandlerInterface {
    private delegate: DelegateCommandHandler;
    private commands: { [id: string]: Command; };

    constructor(protected container: Container) {
        this.commands = {};
        this.delegate = new DelegateCommandHandler(container)
    }

    load() {
        let commands = loader(__dirname + '/../../commands', this.container);
        this.container.get('logger').info(`${commands.length} commands successfully loaded`);

        for (const cmd of commands) {
            let trigger = cmd.trigger;
            if (!Array.isArray(trigger)) {
                trigger = [trigger]
            }

            for (const t of trigger) {
                this.commands[t] = cmd
            }
        }

        this.container.get('logger').info(`${Object.keys(this.commands).length} commands triggers registered`)
    }

    async handle(message: Discord.Message) {
        await this.delegate.handle(message, this.commands)
    }
}