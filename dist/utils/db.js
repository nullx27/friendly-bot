"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
class DB {
    constructor(logger) {
        // @ts-ignore
        this.db = redis_1.default.createClient({
            'host': process.env.REDIS_HOST,
            'port': process.env.REDIS_PORT,
            'db': process.env.REDIS_DATABASE,
            'password': process.env.REDIS_PASSWORD,
        });
        this.logger = logger;
        this.db.on('error', err => this.logger.error('Redis: ' + err));
        this.db.on('ready', () => this.logger.info('Redis connection established!'));
        this.getAsync = util_1.promisify(this.db.get).bind(this.db);
    }
    async set(key, value) {
        return await this.db.set(key, JSON.stringify(value));
    }
    async setWithExpiry(key, value, expiry) {
        return await this.db.set(key, JSON.stringify(value), 'EX', expiry);
    }
    async get(key) {
        let ret = await this.getAsync(key);
        return JSON.parse(ret);
    }
    async pull(key) {
        let val = await this.get(key);
        await this.db.del(key);
        return val;
    }
    getClient() {
        return this.db;
    }
}
exports.DB = DB;
