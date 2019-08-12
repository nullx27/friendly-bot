"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
class Message {
    constructor(channel) {
        this.channel = channel;
        this.embed = new discord_js_1.default.RichEmbed();
        this.embed.setColor('ORANGE');
    }
    setTitle(title) {
        this.embed.setTitle(title);
        return this;
    }
    setFooter(footer) {
        this.embed.setFooter(footer);
        return this;
    }
    addField(name, value, inline = false) {
        this.embed.addField(name, value, inline);
        return this;
    }
    getEmbed() {
        return this.embed;
    }
    send(message = '') {
        this.channel.send(message, this.embed);
    }
}
exports.Message = Message;
