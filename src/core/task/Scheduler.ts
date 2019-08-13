import moment from "moment";
import {Task} from './Task';
import {Container} from "../utils/Container";

export class Scheduler {
    protected lock: boolean = false;
    protected container: Container;
    protected tasks: Task[] = [];

    constructor(container: Container) {
        this.container = container;
    }

    addTask(task: Task) {
        this.tasks.push(task)
    }

    async run(): Promise<void> {
        this.tasks.forEach((task, index) => {
            if (task.schedule instanceof Date) {
                if (moment().diff(task.schedule) > 0) {
                    task.execute(this.container);
                    this.tasks.splice(index, 1);
                }
            } else {
                // @ts-ignore
                if (task.lastExecute + moment(task.schedule).format('x') <= moment().format('x')) {
                    task.execute(this.container);
                    task.lastExecute = parseInt(moment().format('x'));
                }
            }
        })
    }
}