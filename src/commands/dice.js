'use strict'

const Command = require('../models/Command')
const Reply = require('../models/messages/Reply')
const Help = require('../models/messages/Help')

class Dice extends Command {
    trigger () {
        return ['dice', 'roll', 'd']
    }

    help () {
        return new Help().addTitle('Dice').
            addDescription('Roll a dice').
            addCommand('![dice, roll, d] <input>', 'Roll a dice, takes a dice string like 1d6 or 2d10')
    }

    getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    handle (message, args) {
        if (args.length === 0)
            throw 'Missing Arguments'

        const regex = new RegExp(/(\d+)?d(\d+)([\+\-]\d+)?/i)

        if (!regex.test(args[0]))
            throw 'Wrong Argument Format'

        let chunks = args[0].match(regex)
        let reply = new Reply(message)
        reply.setTitle(`Rolled ${args[0]} Dice`)

        for (let i = 0; i < chunks[1]; i++) {
            reply.addField(`Dice ${i + 1}`, this.getRandomInt(1, chunks[2]))
        }

        reply.send()
    }
}

module.exports = Dice