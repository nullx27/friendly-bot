"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var Message_1 = require("./Message");
var Reply = /** @class */ (function (_super) {
    __extends(Reply, _super);
    function Reply(origMessage) {
        var _this = _super.call(this, origMessage.channel) || this;
        _this.embed = new discord_js_1.default.RichEmbed();
        _this.embed.setFooter("Requested by " + origMessage.author.username, origMessage.author.avatarURL);
        _this.embed.setTimestamp();
        _this.embed.setColor('ORANGE');
        return _this;
    }
    return Reply;
}(Message_1.Message));
exports.Reply = Reply;
