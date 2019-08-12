"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const Message_1 = require("./Message");
class Reply extends Message_1.Message {
    constructor(origMessage) {
        super(origMessage.channel);
        this.embed = new discord_js_1.default.RichEmbed();
        this.embed.setFooter(`Requested by ${origMessage.author.username}`, origMessage.author.avatarURL);
        this.embed.setTimestamp();
        this.embed.setColor('ORANGE');
    }
}
exports.Reply = Reply;
