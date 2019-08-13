import {Notification} from "../core/base/Notification";
import {Container} from "../core/utils/Container";

class Presence extends Notification {
    private readonly provider: string;
    private readonly interval: number;

    constructor(container: Container) {
        super(container);

        const config = this.container.get('config');
        this.provider = config.PRESENCE_PROVIDER;
        this.interval = parseInt(config.PRESENCE_UPDATE_INTERVAL);
    }

    async handle(): Promise<void> {
        if (!this.provider) {
            this.container.get('logger').info('No Presence Provider set. Skipping...');
            return;
        }

        this.container.get('logger').info('Using Precense Provider: ' + this.provider);
        const provider = require(`../tasks/presence/${this.provider}`);
        this.container.get('scheduler').addTask(new provider(this.interval));
    }
}

module.exports = Presence;