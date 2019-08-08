'use strict';

class SimpleReply {
    constructor(originalMessage, reply) {
        this.dmsg = originalMessage;
        this.reply = reply;
    }

    async send() {
        await this.dmsg.channel.send(this.reply, {});
    }
}

module.exports = SimpleReply;