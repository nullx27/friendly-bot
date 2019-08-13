import {Task} from "../../core/task/Task";
import {EveOnlineStatus} from "../../fetcher/EveOnlineStatus";
import moment from "moment";

class Eveonline extends Task {
    async run () {
        const status = await EveOnlineStatus().
            catch((e) => this.bot.logger.warn('Can\'t fetch Eve Online Status. Error: ' + e));

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