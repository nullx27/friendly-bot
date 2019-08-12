"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimpleReply {
    constructor(originalMessage, reply) {
        this.dmsg = originalMessage;
        this.reply = reply;
    }
    async send() {
        await this.dmsg.channel.send(this.reply, {});
    }
}
exports.SimpleReply = SimpleReply;
