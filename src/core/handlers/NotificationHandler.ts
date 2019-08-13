import loader from '../utils/Loader';
import {HandlerInterface} from "../contracts/HandlerInterface";
import {Notification} from "../base/Notification";
import {Container} from "../utils/Container";

export class NotificationHandler implements HandlerInterface {
    private notifications: Notification[];

    constructor(protected container: Container) {
        this.notifications = [];
    }

    async load(): Promise<void> {
        this.notifications = loader(__dirname + '/../../notifications', this.container);
        this.container.get('logger').info(`${this.notifications.length} Notifiers loaded`);
        await this.handle();
    }

    async handle(): Promise<void> {
        for (const notification of this.notifications) {
            notification.handle();
        }
    }
}