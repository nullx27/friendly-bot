import {Command} from "../core/base/Command";
import {trigger} from "../core/utils/Decorators";
import {Reply} from "../core/models/messages/Reply";
import {Help} from "../core/models/messages/Help";
import moment from 'moment-timezone';
import Discord from 'discord.js';

@trigger('time')
class Time extends Command {
    help() {
        return new Help()
            .addTitle('Global Time')
            .addDescription('Shows the current or a set time for different Timezones!')
            .addCommand('!time', 'Shows current time in different timezones')
            .addCommand('!time <time>', 'Takes an UTC time and shows it in different Timezones')
            .addDescription('<time> needs to in format with HH:mm.')
    }

    async handle(message: Discord.Message, args: string[]) {
        let time = moment();

        if (args.length > 0) {
            let arg = args[0];
            let regex = new RegExp(/^(\\d{1,2}):(\\d{2})(?::(\\d{2}))?$/);

            if (!regex.test(arg)) throw 'Wrong Argument Format!';

            time = moment(arg, ['h:m a', 'H:m']);
        }

        let data = {
            'EVE': time.utc().format('HH:mm'),
            'EU': time.tz('Europe/Berlin').format('HH:mm'),
            'US East': time.tz('America/New_York').format('HH:mm'),
            'US West': time.tz('America/Los_Angeles').format('HH:mm'),
            'AU': time.tz('Australia/Sydney').format('HH:mm'),
            'RUS': time.tz('Europe/Moscow').format('HH:mm'),
        };

        new Reply(message)
            .addField('Timezone', Object.keys(data).join('\n'), true)
            .addField('Time', Object.values(data).join('\n'), true)
            .send();
    }
}

module.exports = Time;
