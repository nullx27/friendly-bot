"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Notification = /** @class */ (function () {
    function Notification(container) {
        this.container = container;
        this.init();
    }
    Notification.prototype.init = function () { };
    ;
    Notification.prototype.handle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    return Notification;
}());
exports.Notification = Notification;
