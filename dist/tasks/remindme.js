"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Task_1 = require("../core/task/Task");
var Message_1 = require("../core/models/messages/Message");
var moment_1 = __importDefault(require("moment"));
var RemindMeTask = /** @class */ (function (_super) {
    __extends(RemindMeTask, _super);
    function RemindMeTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemindMeTask.prototype.run = function (container) {
        return __awaiter(this, void 0, void 0, function () {
            var storage, remove, _a, _b, _i, i, _c, _d, index;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, container.get('db').pull('remindme')];
                    case 1:
                        storage = _e.sent();
                        remove = [];
                        _a = [];
                        for (_b in storage)
                            _a.push(_b);
                        _i = 0;
                        _e.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        i = _a[_i];
                        if (!(moment_1.default(storage[i].time).diff(moment_1.default()) < 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sendNotification(storage[i], container)];
                    case 3:
                        _e.sent();
                        remove.push(i);
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        //clean up
                        for (_c = 0, _d = remove.reverse(); _c < _d.length; _c++) {
                            index = _d[_c];
                            storage.splice(index, 1);
                        }
                        return [4 /*yield*/, container.get('db').set('remindme', storage)];
                    case 6:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RemindMeTask.prototype.sendNotification = function (reminder, container) {
        return __awaiter(this, void 0, void 0, function () {
            var user, dmchannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, container.get('discord').fetchUser(reminder.user)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, user.createDM()];
                    case 2:
                        dmchannel = _a.sent();
                        new Message_1.Message(dmchannel)
                            .addField('Reminder', reminder.msg)
                            .setFooter('Reminder set at ' + moment_1.default(reminder.created).format('YYYY-MM-DD HH:mm'))
                            .send();
                        return [2 /*return*/];
                }
            });
        });
    };
    return RemindMeTask;
}(Task_1.Task));
exports.RemindMeTask = RemindMeTask;
