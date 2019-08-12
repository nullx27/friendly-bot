"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class Scheduler {
    constructor(bot) {
        this.lock = false;
        this.tasks = [];
        this.bot = bot;
    }
    addTask(task) {
        this.tasks.push(task);
    }
    async run() {
        this.tasks.forEach((task, index) => {
            if (task.schedule instanceof Date) {
                if (moment_1.default().diff(task.schedule) > 0) {
                    task.execute();
                    this.tasks.splice(index, 1);
                }
            }
            else {
                // @ts-ignore
                if (task.lastExecute + task.schedule.format('x') <= moment_1.default().format('x')) {
                    task.execute();
                    task.lastExecute = parseInt(moment_1.default().format('x'));
                }
            }
        });
    }
}
exports.Scheduler = Scheduler;
