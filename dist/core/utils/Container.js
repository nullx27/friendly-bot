"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Container = /** @class */ (function () {
    function Container() {
        this._dependencies = {};
    }
    Container.prototype.register = function (name, dependency) {
        this._dependencies[name] = dependency;
    };
    Container.prototype.get = function (name) {
        if (!this._dependencies.hasOwnProperty(name)) {
            throw Error("Dependency " + name + " not found!");
        }
        return this._dependencies[name];
    };
    return Container;
}());
exports.Container = Container;
