'use strict';

const Module = require('../module');
const moment = require('moment-timezone');

class Time extends Module {
    trigger(){
        return "time";
    }

    help() {
        return "The time around the world" +
            "\n\n" +
            "Available commands:\n" +
            "!time";
    }

    handle(message){

        var msg = "```";
        msg += "EVE: \t\t" + moment().utc().format("HH:mm") + "\n";
        msg += "EU:  \t\t" + moment().tz("Europe/Berlin").format("HH:mm") + "\n";
        msg += "US East: \t" + moment().tz("America/New_York").format("HH:mm") + "\n";
        msg += "US West: \t" + moment().tz("America/Los_Angeles").format("HH:mm") + "\n";
        msg += "AU:  \t\t" + moment().tz("Australia/Sydney").format("HH:mm") + "\n";
        msg += "RUS: \t\t" + moment().tz("Europe/Moscow").format("HH:mm") + "\n";
        msg += "```";

        message.channel.send(msg);
    }
}

module.exports = function(bot) {
    new Time(bot);
};