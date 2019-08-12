import moment from "moment";
import {FriendlyBot} from "../friendly-bot";
import {Task} from '../models/Task';

export class Scheduler {
    protected lock: boolean = false;
    protected bot: FriendlyBot;
    protected tasks: Task[] = [];

    constructor(bot: FriendlyBot) {
        this.bot = bot;
    }

    addTask(task: Task) {
        this.tasks.push(task)
    }

    async run(): Promise<void> {
        this.tasks.forEach((task, index) => {
            if (task.schedule instanceof Date) {
                if (moment().diff(task.schedule) > 0) {
                    task.execute();
                    this.tasks.splice(index, 1);
                }
            } else {
                // @ts-ignore
                if (task.lastExecute + task.schedule.format('x') <= moment().format('x')) {
                    task.execute();
                    task.lastExecute = parseInt(moment().format('x'));
                }
            }
        })
    }
}