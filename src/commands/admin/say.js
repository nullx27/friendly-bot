'use strict'

const Command = require('../../models/Command')
const Message = require('../../models/messages/Message')

class Say extends Command {
    trigger () {
        return 'say'
    }

    async handle (message, args) {
        let str = args.join(' ')
        let regex = new RegExp(/(.+)\s\"(.+)\"/i)

        if (!regex.test(str)) {
            throw 'Wrong Argument format!'
        }

        let chunks = str.match(regex)
        let channel = null

        regex = new RegExp(/<#(\d+)>/i)
        if (regex.test(chunks[1])) {
            channel = this.bot.client.channels.get(chunks[1].match(regex)[1])
        } else {
            channel = this.bot.client.channels.find(x => x.name === chunks[1])
        }

        if (!channel) throw 'Channel not found!'

        let msg = chunks[2].trim('"')
        await channel.send(msg)
    }
}

module.exports = Say