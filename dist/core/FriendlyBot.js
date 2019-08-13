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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommandHandler_1 = require("./handlers/CommandHandler");
var discord_js_1 = __importDefault(require("discord.js"));
var NotificationHandler_1 = require("./handlers/NotificationHandler");
var Scheduler_1 = require("./task/Scheduler");
var db_1 = require("./utils/db");
var Logger_1 = require("./utils/Logger");
var FriendlyBot = /** @class */ (function () {
    function FriendlyBot(container) {
        this.bootstrapped = false;
        this.container = container;
        this.container.register('logger', Logger_1.makeLogger(container));
        this.token = container.get('config').DISCORD_TOKEN;
        this.client = new discord_js_1.default.Client({
            fetchAllMembers: false,
            ws: {
                large_threshold: 500,
                compress: true,
            },
        });
        this.container.register('discord', this.client);
        this.container.register('scheduler', new Scheduler_1.Scheduler(container));
        this.container.register('db', new db_1.DB(container));
        this.commandHandler = new CommandHandler_1.CommandHandler(container);
        this.notifyHandler = new NotificationHandler_1.NotificationHandler(container);
        this.registerEventHandlers();
    }
    FriendlyBot.prototype.registerEventHandlers = function () {
        var _this = this;
        this.client.once('ready', function () { return _this.readyEvent(); });
        this.client.on('disconnect', function (event) {
            _this.container.get('logger').error("Disconnected with close event: " + event.code);
        });
        this.client.on('error', function (error) { return _this.container.get('logger').error(error); });
        this.client.on('warn', function (warning) { return _this.container.get('logger').warning(warning); });
        this.client.on('message', function (message) { return _this.commandHandler.handle(message); });
    };
    FriendlyBot.prototype.readyEvent = function () {
        if (this.bootstrapped)
            return;
        this.container.get('logger').info('Ready event received, starting normal operation.');
        this.commandHandler.load();
        this.notifyHandler.load();
        this.setupScheduler();
        this.bootstrapped = true;
    };
    FriendlyBot.prototype.setupScheduler = function () {
        var scheduler = this.container.get('scheduler');
        setInterval(scheduler.run.bind(scheduler), 1000);
    };
    FriendlyBot.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.container.get('logger').info('Bot started');
                        return [4 /*yield*/, this.client.login(this.token)];
                    case 1:
                        _a.sent();
                        this.container.get('logger').info('Successfully logged in');
                        return [2 /*return*/];
                }
            });
        });
    };
    return FriendlyBot;
}());
exports.FriendlyBot = FriendlyBot;
