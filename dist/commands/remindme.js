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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var Command_1 = require("../core/base/Command");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var chrono_node_1 = __importDefault(require("chrono-node"));
var Reply_1 = require("../core/models/messages/Reply");
var remindme_1 = require("../tasks/remindme");
var FriendlyBot_1 = require("../core/FriendlyBot");
var RemindMe = /** @class */ (function (_super) {
    __extends(RemindMe, _super);
    function RemindMe(bot) {
        var _this = _super.call(this, bot) || this;
        _this.bot.scheduler.addTask(new remindme_1.RemindMeTask(_this.bot, 3000));
        return _this;
    }
    RemindMe.prototype.handle = function (message, args) {
        return __awaiter(this, void 0, void 0, function () {
            var str, regex, chunks, time_str, msg, time, storage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        str = args.join(' ');
                        regex = new RegExp(/(.+)\s\"(.+)\"/i);
                        if (!regex.test(str))
                            throw 'Wrong Argument format!';
                        chunks = str.match(regex);
                        if (chunks === null)
                            throw 'Wrong Argument format!';
                        time_str = chunks[1].trim();
                        msg = chunks[2].trim();
                        try {
                            time = chrono_node_1.default.parseDate(time_str, moment_timezone_1.default().toDate());
                        }
                        catch (e) {
                            throw "Could not parse date!";
                        }
                        return [4 /*yield*/, this.bot.db.pull('remindme')];
                    case 1:
                        storage = _a.sent();
                        if (storage === null || !Array.isArray(storage))
                            storage = [];
                        storage.push({ time: time, msg: msg, user: message.author.id, created: moment_timezone_1.default() });
                        return [4 /*yield*/, this.bot.db.set('remindme', storage)];
                    case 2:
                        _a.sent();
                        new Reply_1.Reply(message)
                            .setTitle('Created a new Reminder')
                            .addField('Time', moment_timezone_1.default(time).format('dddd, MMMM Do YYYY, HH:mm z'))
                            .addField('Message', msg)
                            .send();
                        return [2 /*return*/];
                }
            });
        });
    };
    RemindMe = __decorate([
        Command_1.trigger('remindme'),
        __metadata("design:paramtypes", [FriendlyBot_1.FriendlyBot])
    ], RemindMe);
    return RemindMe;
}(Command_1.Command));
module.exports = RemindMe;
