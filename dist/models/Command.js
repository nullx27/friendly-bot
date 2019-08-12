"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Help_1 = require("./messages/Help");
class Command {
    constructor(bot) {
        this.bot = bot;
        this._trigger = '';
        this.bot = bot;
    }
    get trigger() {
        return this._trigger;
    }
    set trigger(value) {
        this._trigger = value;
    }
    help() {
        return new Help_1.Help().addTitle("NOT SET!");
    }
    async handle(message, args, trigger) {
    }
}
exports.Command = Command;
function trigger(trigger) {
    return function (constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this._trigger = trigger;
            }
        };
    };
}
exports.trigger = trigger;
