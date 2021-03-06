import {Task} from "../../core/task/Task";
import {fetchStatus} from "../../fetcher/Esi";
import moment from "moment";
import {Container} from "../../core/utils/Container";

class Eveonline extends Task {
    async run (container: Container) {
        const status = await fetchStatus().
            catch((e) => container.get('logger').warn('Can\'t fetch Eve Online Status. Error: ' + e));

        if (status !== null) {
            await container.get('discord').user.setPresence(
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