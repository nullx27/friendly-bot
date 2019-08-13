export class Container {
    private _dependencies: { [key: string]: any };

    constructor() {
        this._dependencies = {};
    }

    register<T>(name: string, dependency: T): void {
        this._dependencies[name] = dependency;
    }

    get(name: string): any {
        if (!this._dependencies.hasOwnProperty(name)) {
            throw Error(`Dependency ${name} not found!`);
        }

        return this._dependencies[name];
    }
}