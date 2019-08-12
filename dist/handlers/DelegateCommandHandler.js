"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reply_1 = require("../models/messages/Reply");
const AdminCommand_1 = require("../models/AdminCommand");
class DelegateCommandHandler {
    constructor() {
        // @ts-ignore
        this.admins = process.env.ADMIN.split(',');
        // @ts-ignore
        this.restricted = process.env.RESTRICTED_CHANNELS.split(',');
        // @ts-ignore
        this.prefix = process.env.CMD_PREFIX;
    }
    async handle(message, commands) {
        if (!message.content.startsWith(this.prefix))
            return;
        if (message.channel.id in this.restricted)
            return;
        let [trigger, args] = this.parse(message.content);
        if (trigger === 'help') {
            if (!args[0]) {
                this.sendHelp(message, Object.keys(commands));
            }
            if (args[0] in commands) {
                let help = commands[args[0]].help();
                message.channel.send(help.getMessage());
            }
        }
        if (!Object.keys(commands).includes(trigger)) {
            this.sendError(message, 'Not Found', `Command not found, try ${process.env.CMD_PREFIX}help`);
            return;
        }
        if (commands[trigger] instanceof AdminCommand_1.AdminCommand) {
            if (!this.admins.includes(message.author.id)) {
                this.sendError(message, 'Denied', 'You\'re missing the required privileges to use this command.');
                return;
            }
        }
        try {
            await commands[trigger].handle(message, args, trigger);
        }
        catch (e) {
            if (e instanceof Error) {
                throw e;
            }
            this.sendError(message, 'Message', e);
        }
    }
    parse(message) {
        let chunks = message.split(' ');
        return [chunks[0].substring(1), chunks.splice(1)];
    }
    sendHelp(message, triggers) {
        let reply = new Reply_1.Reply(message);
        reply.setTitle('Help');
        reply.addField('Available Commands', triggers.map(x => this.prefix + x).join('\n'));
        reply.addField('Further Help', `If you want to know more about a command use ${this.prefix}help <command-without-${this.prefix}>`);
        reply.send();
    }
    sendError(message, title, msg) {
        (new Reply_1.Reply(message)).setTitle('Error').addField(title, msg).send();
    }
}
exports.DelegateCommandHandler = DelegateCommandHandler;
