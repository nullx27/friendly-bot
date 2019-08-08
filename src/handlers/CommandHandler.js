'use strict'

const loader = require('../utils/loader')
const Command = require('../models/Command')
const Reply = require('../models/messages/Reply')

class CommandHandler {
    constructor (logger, bot) {
        this.logger = logger
        this.bot = bot
        this.commands = {}
        this.prefix = process.env.CMD_PREFIX
    }

    async load () {
        let cmds = await loader(__dirname + '/../commands', this.bot)
        this.bot.logger.info(`${cmds.length} commands successfully loaded`)

        cmds.forEach(cmd => {
            if (!cmd.prototype instanceof Command) {
                this.bot.logger.alert(`${cmd} is not a Command!`)
                return
            }

            let trigger = cmd.trigger()
            if (!Array.isArray(trigger)) {
                trigger = [trigger]
            }

            trigger.forEach(trigger => {
                this.commands[trigger] = cmd
            })
        })

        this.bot.logger.info(`${Object.keys(this.commands).length} commands triggers registered`)
    }

    async handle (message) {
        if (!message.content.startsWith(this.prefix)) {
            return
        }

        let chunks = message.content.split(' ')
        let trigger = chunks[0].substring(1)
        let help = false

        if (trigger === 'help') {
            if (!chunks[1]) {
                let reply = new Reply(message)
                reply.setTitle('Help')
                reply.addField('Available Commands', Object.keys(this.commands).map(x => '!' + x).join('\n'))
                reply.addField('Further Help',
                    `If you want to know more about a command use ${this.prefix}help <command-without-${this.prefix}>`)
                reply.send()
                return
            }

            help = true
            trigger = chunks[1]
        }

        if (trigger in this.commands) {
            try {
                if (!help) {
                    await this.commands[trigger].handle(message, chunks.splice(1), trigger)
                } else {
                    let helpReply = this.commands[trigger].help()
                    message.channel.send(helpReply.getMessage())
                }
            } catch (e) {
                console.log(e)
                let helpReply = this.commands[trigger].help()
                message.channel.send(e, helpReply.getMessage())
            }
        } else {
            message.reply('Command not found') //todo: better handling here
            this.bot.logger.info(`Command not found for trigger ${trigger}`)
        }
    }
}

module.exports = CommandHandler