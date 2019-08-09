'use strict'

const Reply = require('../models/messages/Reply')
const AdminCommand = require('../models/AdminCommand')

class DelegateCommandHandler {

    constructor () {
        this.admins = process.env.ADMIN.split(',')
        this.restricted = process.env.RESTRICTED_CHANNELS.split(',')
        this.prefix = process.env.CMD_PREFIX
    }

    async handle (message, commands) {
        if (!message.content.startsWith(this.prefix)) return null
        if (message.channel.id in this.restricted) return null

        let [trigger, args] = this.parse(message.content)

        if (trigger === 'help') {
            if (!args[0]) {
                this.sendHelp(message, Object.keys(commands))
                return null
            }

            if (args[0] in commands) {
                let help = commands[args[0]].help()

                if (!help) {
                    this.sendError(message, 'Command', 'No help defined for Command ' + args[0])
                    return null
                }

                message.channel.send(help.getMessage())
                return null
            }
        }

        if (!Object.keys(commands).includes(trigger)) {
            this.sendError(message, 'Not Found', `Command not found, try ${process.env.CMD_PREFIX}help`)
            return null
        }

        if (commands[trigger] instanceof AdminCommand) {
            if (!this.admins.includes(message.author.id)) {
                this.sendError(message, 'Denied', 'You\'re missing the required privileges to use this command.')
                return null
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

    parse (message) {
        let chunks = message.split(' ')
        return [chunks[0].substring(1), chunks.splice(1)]
    }

    sendHelp (message, triggers) {
        let reply = new Reply(message)
        reply.setTitle('Help')
        reply.addField('Available Commands', triggers.map(x => this.prefix + x).join('\n'))
        reply.addField('Further Help',
            `If you want to know more about a command use ${this.prefix}help <command-without-${this.prefix}>`)
        reply.send()
    }

    sendError (message, title, msg) {
        let reply = new Reply(message)
        reply.setTitle('Error')
        reply.addField(title, msg)
        reply.send()
    }

}

module.exports = DelegateCommandHandler