import {Help} from "../models/messages/Help";
import Discord from 'discord.js';
import {Loadable} from '../contracts/Loadable';
import {Container} from "../utils/Container";

export abstract class Command implements Loadable {

    private _trigger: string | string[] = '';

    constructor(protected container: Container) {

    }

    public get trigger(): string | string[] {
        return this._trigger;
    }

    public set trigger(value: string | string[]) {
        this._trigger = value;
    }

    help(trigger: string): Help {
        return new Help().addTitle("NOT SET!");
    }

    async handle(message: Discord.Message, args: any[], trigger: string): Promise<void> {}
}