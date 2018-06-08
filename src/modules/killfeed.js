'use strict';

const Module = require('../module');
const WebSocket = require('ws');

class Killfeed extends Module {

    init() {
        const ws = new WebSocket('wss://zkillboard.com:2096');
        let _this = this;

        let filter = {
            "action": "sub",
            "channel": "alliance:" + this.bot.config.allianceID
        };

        ws.on('open', function open() {
            ws.send(JSON.stringify(filter));
        });

        ws.on('message', function incoming(data) {
            _this.sendMessage(data);
        });
    }

    help() {
        return "zKillboard feed. No commands available.";
    }

    sendMessage(data) {
        data = JSON.parse(data);
        this.bot.getChannelById(this.bot.config.boardcast_channel).send(data.url);
    }
}

module.exports = function (bot) {
    new Killfeed(bot);
};