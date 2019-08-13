"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var Help = /** @class */ (function () {
    function Help() {
        this.msg = new discord_js_1.default.RichEmbed();
        this.msg.setTimestamp();
        return this;
    }
    Help.prototype.addTitle = function (title) {
        this.msg.setTitle('Help: ' + title);
        return this;
    };
    Help.prototype.addDescription = function (desc) {
        this.msg.addField('\u200B', desc, true);
        return this;
    };
    Help.prototype.addCommand = function (cmd, desc) {
        this.msg.addField(cmd, desc);
        return this;
    };
    Help.prototype.getMessage = function () {
        return this.msg;
    };
    return Help;
}());
exports.Help = Help;
