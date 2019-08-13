"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var Message = /** @class */ (function () {
    function Message(channel) {
        this.channel = channel;
        this.embed = new discord_js_1.default.RichEmbed();
        this.embed.setColor('ORANGE');
    }
    Message.prototype.setTitle = function (title) {
        this.embed.setTitle(title);
        return this;
    };
    Message.prototype.setFooter = function (footer) {
        this.embed.setFooter(footer);
        return this;
    };
    Message.prototype.addField = function (name, value, inline) {
        if (inline === void 0) { inline = false; }
        this.embed.addField(name, value, inline);
        return this;
    };
    Message.prototype.getEmbed = function () {
        return this.embed;
    };
    Message.prototype.send = function (message) {
        if (message === void 0) { message = ''; }
        this.channel.send(message, this.embed);
    };
    return Message;
}());
exports.Message = Message;
