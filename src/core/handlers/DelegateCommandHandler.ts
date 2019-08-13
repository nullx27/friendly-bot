import {Reply} from "../models/messages/Reply";
import {AdminCommand} from "../base/AdminCommand";
import {HandlerInterface} from "../contracts/HandlerInterface";
import Discord from 'discord.js';
import {Command} from "../base/Command";
import {Container} from "../utils/Container";

export class DelegateCommandHandler implements HandlerInterface {
    private admins: string[];
    private readonly restricted: string[];
    private readonly prefix: string;

    constructor(protected container: Container) {
        const config = container.get('config');

        this.admins = config.ADMIN.split(',');
        this.restricted = config.RESTRICTED_CHANNELS.split(',');
        this.prefix = config.CMD_PREFIX;
    }

    async handle(message: Discord.Message, commands: { [id: string]: Command; }): Promise<void> {
        if (!message.content.startsWith(this.prefix)) return;
        if (message.channel.id in this.restricted) return;

        let chunks = message.content.split(' ');
        let [trigger, args] = [chunks[0].substring(1), chunks.splice(1)];

        if (trigger === 'help') {
            if (!args[0]) {
                this.sendHelp(message, Object.keys(commands));
                return;
            }

            if (args[0] in commands) {
                let help = commands[args[0]].help(args[0]);
                message.channel.send(help.getMessage());
                return;
            }
        }

        if (!Object.keys(commands).includes(trigger)) {
            this.sendError(message, 'Not Found', `Command not found, try ${process.env.CMD_PREFIX}help`);
            return;
        }

        if (commands[trigger] instanceof AdminCommand) {
            if (!this.admins.includes(message.author.id)) {
                this.sendError(message, 'Denied', 'You\'re missing the required privileges to use this command.');
                return;
            }
        }

        try {
            await commands[trigger].handle(message, args, trigger)
        } catch (e) {
            if (e instanceof Error) {
                throw e
            }

            this.sendError(message, 'Message', e)
        }

    }

    private sendHelp(message: Discord.Message, triggers: string[]) {
        let reply = new Reply(message);
        reply.setTitle('Help');
        reply.addField('Available Commands', triggers.map(x => this.prefix + x).join('\n'));
        reply.addField('Further Help', `If you want to know more about a command use ${this.prefix}help <command-without-${this.prefix}>`);
        reply.send();
    }

    private sendError(message: Discord.Message, title: string, msg: string) {
        (new Reply(message)).setTitle('Error').addField(title, msg).send();
    }
}