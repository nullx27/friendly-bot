'use strict'

const Task = require('../../models/Task')
const eveOnlineStatus = require('../../fetcher/EveOnlineStatus')
const moment = require('moment')

class Eveonline extends Task {

    constructor (bot, interval) {
        super()
        this.bot = bot
        this.target = interval
    }

    schedule () {
        return this.target
    }

    async run () {
        const status = await eveOnlineStatus()

        if (status !== null) {
            this.bot.client.user.setPresence(
                {
                    status: 'online',
                    afk: false,
                    game: {
                        name: `you | ${moment().
                            utc().
                            format('HH:mm')} EVE | Online ${status.players}`,
                        type: 'WATCHING',
                    },
                },
            )
        }

    }
}

module.exports = Eveonline