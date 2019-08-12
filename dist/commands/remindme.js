"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../models/Command");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const chrono_node_1 = __importDefault(require("chrono-node"));
const Reply_1 = require("../models/messages/Reply");
const remindme_1 = require("../tasks/remindme");
const friendly_bot_1 = require("../friendly-bot");
let RemindMe = class RemindMe extends Command_1.Command {
    constructor(bot) {
        super(bot);
        this.bot.scheduler.addTask(new remindme_1.RemindMeTask(this.bot, 3000));
    }
    async handle(message, args) {
        let str = args.join(' ');
        let regex = new RegExp(/(.+)\s\"(.+)\"/i);
        if (!regex.test(str))
            throw 'Wrong Argument format!';
        let chunks = str.match(regex);
        if (chunks === null)
            throw 'Wrong Argument format!';
        let time_str = chunks[1].trim();
        let msg = chunks[2].trim();
        let time;
        try {
            time = chrono_node_1.default.parseDate(time_str, moment_timezone_1.default().toDate());
        }
        catch (e) {
            throw "Could not parse date!";
        }
        let storage = await this.bot.db.pull('remindme');
        if (storage === null || !Array.isArray(storage))
            storage = [];
        storage.push({ time: time, msg: msg, user: message.author.id, created: moment_timezone_1.default() });
        await this.bot.db.set('remindme', storage);
        new Reply_1.Reply(message)
            .setTitle('Created a new Reminder')
            .addField('Time', moment_timezone_1.default(time).format('dddd, MMMM Do YYYY, HH:mm z'))
            .addField('Message', msg)
            .send();
    }
};
RemindMe = __decorate([
    Command_1.trigger('remindme'),
    __metadata("design:paramtypes", [friendly_bot_1.FriendlyBot])
], RemindMe);
module.exports = RemindMe;
