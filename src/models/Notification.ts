import {FriendlyBot} from "../friendly-bot";
import {Loadable} from "./Loadable";

export abstract class Notification implements Loadable {
    protected bot: FriendlyBot;

    protected constructor(bot: FriendlyBot) {
        this.bot = bot
    }

    handle(...args: any): void {}
}