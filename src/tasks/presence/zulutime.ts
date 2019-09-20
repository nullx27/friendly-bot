import {Task} from "../../core/task/Task";
import moment from "moment";
import {Container} from "../../core/utils/Container";

class Zulutime extends Task {
    async run (container: Container) {
        await container.get('discord').user.setPresence(
            {
                status: 'online',
                afk: false,
                game: {
                    name: `Time | ${moment().
                    utc().
                    format('HH:mm')} ZULU`,
                    type: 'PLAYING',
                },
            },
        )
    }

}

module.exports = Zulutime