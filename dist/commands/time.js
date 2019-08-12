"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../models/Command");
const Reply_1 = require("../models/messages/Reply");
const Help_1 = require("../models/messages/Help");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
let Time = class Time extends Command_1.Command {
    help() {
        return new Help_1.Help()
            .addTitle('Global Time')
            .addDescription('Shows the current or a set time for different Timezones!')
            .addCommand('!time', 'Shows current time')
            .addCommand('!time HH:mm', 'Shows given time');
    }
    async handle(message, args) {
        let time = moment_timezone_1.default();
        if (args.length > 0) {
            let arg = args[0];
            let regex = new RegExp('/([01]?[0-9]|2[0-3]):[0-5][0-9]/');
            if (!regex.test(arg))
                throw 'Wrong Argument Format!';
            time = moment_timezone_1.default(arg, ['h:m a', 'H:m']);
        }
        let data = {
            'EVE': time.utc().format('HH:mm'),
            'EU': time.tz('Europe/Berlin').format('HH:mm'),
            'US East': time.tz('America/New_York').format('HH:mm'),
            'US West': time.tz('America/Los_Angeles').format('HH:mm'),
            'AU': time.tz('Australia/Sydney').format('HH:mm'),
            'RUS': time.tz('Europe/Moscow').format('HH:mm'),
        };
        new Reply_1.Reply(message)
            .addField('Timezone', Object.keys(data).join('\n'), true)
            .addField('Tile', Object.values(data).join('\n'), true)
            .send();
    }
};
Time = __decorate([
    Command_1.trigger('time')
], Time);
module.exports = Time;
