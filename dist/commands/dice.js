"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../models/Command");
const Reply_1 = require("../models/messages/Reply");
const Help_1 = require("../models/messages/Help");
let Dice = class Dice extends Command_1.Command {
    help() {
        return new Help_1.Help()
            .addTitle('Dice')
            .addDescription('Roll a dice')
            .addCommand('![dice, roll, d] <input>', 'Roll a dice, takes a dice string like 1d6 or 2d10');
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async handle(message, args) {
        if (args.length === 0)
            throw 'Missing Arguments';
        const regex = new RegExp(/(\d+)?d(\d+)([\+\-]\d+)?/i);
        if (!regex.test(args[0]))
            throw 'Wrong Argument Format';
        let chunks = args[0].match(regex);
        if (chunks === null)
            throw 'Wrong Argument Format';
        let num = parseInt(chunks[0]);
        let dice = parseInt(chunks[1]);
        let reply = new Reply_1.Reply(message).setTitle(`Rolled ${args[0]} Dice`);
        for (let i = 0; i < num; i++) {
            reply.addField(`Dice ${i + 1}`, this.getRandomInt(1, dice).toString());
        }
        reply.send();
    }
};
Dice = __decorate([
    Command_1.trigger(['dice', 'roll', 'd'])
], Dice);
module.exports = Dice;
