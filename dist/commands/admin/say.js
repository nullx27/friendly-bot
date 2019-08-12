"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminCommand_1 = require("../../models/AdminCommand");
const Command_1 = require("../../models/Command");
let Say = class Say extends AdminCommand_1.AdminCommand {
    async handle(message, args) {
        let str = args.join(' ');
        let regex = new RegExp(/(.+)\s\"(.+)\"/i);
        if (!regex.test(str))
            throw 'Wrong Argument format!';
        let chunks = str.match(regex);
        if (chunks === null)
            throw 'Wrong Argument format!';
        regex = new RegExp(/<#(\d+)>/i);
        let channel;
        if (regex.test(chunks[1])) {
            // @ts-ignore
            channel = this.bot.client.channels.get(chunks[1].match(regex)[1]);
        }
        else {
            // @ts-ignore
            channel = this.bot.client.channels.find(x => x.name === chunks[1]);
        }
        if (!channel)
            throw 'Channel not found!';
        let msg = chunks[2].trim();
        await channel.send(msg);
    }
};
Say = __decorate([
    Command_1.trigger('say')
], Say);
module.exports = Say;
