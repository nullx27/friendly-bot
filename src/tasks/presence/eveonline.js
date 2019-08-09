'use strict'

const Task = require('../../models/Task')
const eveOnlineStatus = require('../../fetcher/EveOnlineStatus')
const moment = require('moment')

class Eveonline extends Task {
    async run () {
        const status = await eveOnlineStatus().
            catch((e) => this.bot.logger.warn('Can\'t fetch Eve Online Status. Error: ' + e))

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