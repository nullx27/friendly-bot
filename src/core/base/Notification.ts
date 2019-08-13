import {Loadable} from "../contracts/Loadable";
import {Container} from "../utils/Container";

export abstract class Notification implements Loadable {

    protected constructor(protected container: Container) {
        this.init();
    }

    init() {};

    handle(...args: any): void {}
}