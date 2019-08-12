import {FriendlyBot} from "../friendly-bot";
import {Help} from "./messages/Help";
import Discord from 'discord.js';
import {Loadable} from './Loadable';

export abstract class Command implements Loadable {

    private _trigger: string | string[] = '';

    constructor(protected bot: FriendlyBot) {
        this.bot = bot;
    }

    public get trigger(): string | string[] {
        return this._trigger;
    }

    public set trigger(value: string | string[]) {
        this._trigger = value;
    }

    help(): Help {
        return new Help().addTitle("NOT SET!");
    }

    async handle(message: Discord.Message, args: any[], trigger: string): Promise<void> {
    }
}


export function trigger(trigger: string | string[]) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            _trigger = trigger;
        }
    }
}