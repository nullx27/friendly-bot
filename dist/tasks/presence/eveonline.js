"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("../../models/Task");
const EveOnlineStatus_1 = require("../../fetcher/EveOnlineStatus");
const moment_1 = __importDefault(require("moment"));
class Eveonline extends Task_1.Task {
    async run() {
        const status = await EveOnlineStatus_1.EveOnlineStatus().
            catch((e) => this.bot.logger.warn('Can\'t fetch Eve Online Status. Error: ' + e));
        if (status !== null) {
            this.bot.client.user.setPresence({
                status: 'online',
                afk: false,
                game: {
                    name: `you | ${moment_1.default().
                        utc().
                        format('HH:mm')} EVE | Online ${status.players}`,
                    type: 'WATCHING',
                },
            });
        }
    }
}
module.exports = Eveonline;
