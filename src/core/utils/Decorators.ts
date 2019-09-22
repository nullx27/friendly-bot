export function trigger(...trigger: string[]) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        let prototype = constructor.prototype;

        let c = class extends constructor {
            _trigger = trigger.map(f => {return f.toLowerCase(); });
        };

        c.prototype = prototype;
        return c;
    }
}