import {FriendlyBot} from "../friendly-bot";
import moment from "moment";

export abstract class Task {
    protected _lastExecute: number = 0;
    protected lock: boolean = false;
    protected bot: FriendlyBot;
    protected readonly _schedule: number | Date;

    constructor(bot: FriendlyBot, schedule: number | Date) {
        this.bot = bot;
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

    async execute(): Promise<void> {
        if (this.lock) return;

        this.lock = true;
        await this.run();
        this.lock = false;
    }

    async run(): Promise<void> {
    }
}
