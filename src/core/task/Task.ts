import {Container} from "../utils/Container";

export abstract class Task {
    protected _lastExecute: number = 0;
    protected lock: boolean = false;
    protected readonly _schedule: number | Date;

    constructor(schedule: number | Date) {
        this._schedule = schedule
    }

    public get schedule(): number | Date {
        return this._schedule;
    }

    public get lastExecute(): number {
        return this._lastExecute;
    }

    public set lastExecute(value: number) {
        this._lastExecute = value;
    }

    async execute(container: Container): Promise<void> {
        if (this.lock) return;
        this.lock = true;
        await this.run(container);
        this.lock = false;
    }

    async run(container?: Container): Promise<void> {}
}
