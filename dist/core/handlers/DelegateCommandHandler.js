"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Reply_1 = require("../models/messages/Reply");
var AdminCommand_1 = require("../base/AdminCommand");
var DelegateCommandHandler = /** @class */ (function () {
    function DelegateCommandHandler(container) {
        this.container = container;
        var config = container.get('config');
        this.admins = config.ADMIN.split(',');
        this.restricted = config.RESTRICTED_CHANNELS.split(',');
        this.prefix = config.CMD_PREFIX;
    }
    DelegateCommandHandler.prototype.handle = function (message, commands) {
        return __awaiter(this, void 0, void 0, function () {
            var chunks, _a, trigger, args, help, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!message.content.startsWith(this.prefix))
                            return [2 /*return*/];
                        if (message.channel.id in this.restricted)
                            return [2 /*return*/];
                        chunks = message.content.split(' ');
                        _a = [chunks[0].substring(1), chunks.splice(1)], trigger = _a[0], args = _a[1];
                        if (trigger === 'help') {
                            if (!args[0]) {
                                this.sendHelp(message, Object.keys(commands));
                            }
                            if (args[0] in commands) {
                                help = commands[args[0]].help();
                                message.channel.send(help.getMessage());
                            }
                        }
                        if (!Object.keys(commands).includes(trigger)) {
                            this.sendError(message, 'Not Found', "Command not found, try " + process.env.CMD_PREFIX + "help");
                            return [2 /*return*/];
                        }
                        if (commands[trigger] instanceof AdminCommand_1.AdminCommand) {
                            if (!this.admins.includes(message.author.id)) {
                                this.sendError(message, 'Denied', 'You\'re missing the required privileges to use this command.');
                                return [2 /*return*/];
                            }
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, commands[trigger].handle(message, args, trigger)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        if (e_1 instanceof Error) {
                            throw e_1;
                        }
                        this.sendError(message, 'Message', e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DelegateCommandHandler.prototype.sendHelp = function (message, triggers) {
        var _this = this;
        var reply = new Reply_1.Reply(message);
        reply.setTitle('Help');
        reply.addField('Available Commands', triggers.map(function (x) { return _this.prefix + x; }).join('\n'));
        reply.addField('Further Help', "If you want to know more about a command use " + this.prefix + "help <command-without-" + this.prefix + ">");
        reply.send();
    };
    DelegateCommandHandler.prototype.sendError = function (message, title, msg) {
        (new Reply_1.Reply(message)).setTitle('Error').addField(title, msg).send();
    };
    return DelegateCommandHandler;
}());
exports.DelegateCommandHandler = DelegateCommandHandler;
