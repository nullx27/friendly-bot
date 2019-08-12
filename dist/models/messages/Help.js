"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
class Help {
    constructor() {
        this.msg = new discord_js_1.default.RichEmbed();
        this.msg.setTimestamp();
        return this;
    }
    addTitle(title) {
        this.msg.setTitle('Help: ' + title);
        return this;
    }
    addDescription(desc) {
        this.msg.addField('\u200B', desc, true);
        return this;
    }
    addCommand(cmd, desc) {
        this.msg.addField(cmd, desc);
        return this;
    }
    getMessage() {
        return this.msg;
    }
}
exports.Help = Help;
