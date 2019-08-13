import {Task} from "../../core/task/Task";
import {EveOnlineStatus} from "../../fetcher/EveOnlineStatus";
import moment from "moment";
import {Container} from "../../core/utils/Container";

class Eveonline extends Task {
    async run (container: Container) {
        const status = await EveOnlineStatus().
            catch((e) => container.get('logger').warn('Can\'t fetch Eve Online Status. Error: ' + e));

        if (status !== null) {
            await container.get('client').user.setPresence(
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