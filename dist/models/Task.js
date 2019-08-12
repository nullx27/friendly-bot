"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    constructor(bot, schedule) {
        this._lastExecute = 0;
        this.lock = false;
        this.bot = bot;
        this._schedule = schedule;
    }
    get schedule() {
        return this._schedule;
    }
    get lastExecute() {
        return this._lastExecute;
    }
    set lastExecute(value) {
        this._lastExecute = value;
    }
    async execute() {
        if (this.lock)
            return;
        this.lock = true;
        await this.run();
        this.lock = false;
    }
    async run() {
    }
}
exports.Task = Task;
