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
const YouTube_1 = require("../fetcher/YouTube");
let Youtube = class Youtube extends Command_1.Command {
    help() {
        return new Help_1.Help()
            .addTitle('Youtube')
            .addDescription('Post a link for a Video on youtube matching your search term')
            .addCommand('[y, youtube] <search>', 'Search for a youtube video');
    }
    async handle(message, args) {
        if (args.length === 0)
            throw 'Argument Missing!';
        let data = await YouTube_1.YouTube(args.join(' '));
        let reply = new Reply_1.Reply(message).setTitle('YouTube');
        if (data == null || data.items[0].id.videoId == null) {
            reply.addField('Error', 'No video found for that input!').send();
            return;
        }
        reply.send(`https://www.youtube.com/watch?v=${data.items[0].id.videoId}`);
    }
};
Youtube = __decorate([
    Command_1.trigger(['youtube', 'y'])
], Youtube);
module.exports = Youtube;
