"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../models/Command");
const Help_1 = require("../models/messages/Help");
const WolframAlpha_1 = require("../fetcher/WolframAlpha");
const Reply_1 = require("../models/messages/Reply");
let WolframAlpha = class WolframAlpha extends Command_1.Command {
    help() {
        return new Help_1.Help()
            .addTitle('Wolfram Alpha')
            .addDescription('Calculates input though WolframAlpha')
            .addCommand('calc <input>', 'Gives result from calculation from Wolfram Alpha');
    }
    async handle(message, args) {
        if (args.length === 0)
            throw 'Argument missing!';
        const data = await WolframAlpha_1.wolframAlphaFetcher(args[0]);
        let reply = new Reply_1.Reply(message);
        reply.getEmbed().setAuthor('Worlfram|Alpha', 'https://i.imgur.com/YVWvjlM.png');
        reply.getEmbed().setColor(0x00AE86);
        if (data === null) {
            reply.addField('Error', 'There was an error while trying to reach Wolfram Alpha, please try again later!')
                .send();
            return;
        }
        if (!data.queryresult.success) {
            reply.addField('Error', 'Can\'t understand input!').send();
            return;
        }
        for (let pod of data.queryresult.pods) {
            switch (pod.id) {
                case 'Input':
                case 'Result':
                    reply.addField(pod.title, pod.subpods[0].plaintext);
                    break;
                case 'Plot':
                    reply.getEmbed().setImage(pod.subpods[0].img.src);
                    break;
            }
        }
        reply.send();
    }
};
WolframAlpha = __decorate([
    Command_1.trigger('calc')
], WolframAlpha);
module.exports = WolframAlpha;
