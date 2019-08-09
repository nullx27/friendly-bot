'use strict'

const loader = require('../utils/loader')
const Command = require('../models/Command')
const DelegateCommandHandler = require('./DelegateCommandHandler')

class CommandHandler {
    constructor (logger, bot) {
        this.logger = logger
        this.bot = bot
        this.commands = {}
        this.delegate = new DelegateCommandHandler()
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
        await this.delegate.handle(message, this.commands)
        /*.catch((e) => {
            this.logger.warn('Command Delegate: ' + e)
        })*/
    }
}

module.exports = CommandHandler