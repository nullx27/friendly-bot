import redis, {RedisClient} from "redis";
import {promisify} from "util";
import {Logger} from "winston";


export class DB {
    private readonly db: redis.RedisClient;
    private logger: Logger;
    private readonly getAsync: Function;

    constructor(logger: Logger) {
        // @ts-ignore
        this.db = redis.createClient({
            'host': process.env.REDIS_HOST,
            'port': process.env.REDIS_PORT,
            'db': process.env.REDIS_DATABASE,
            'password': process.env.REDIS_PASSWORD,
        });

        this.logger = logger;

        this.db.on('error', err => this.logger.error('Redis: ' + err));
        this.db.on('ready', () => this.logger.info('Redis connection established!'));

        this.getAsync = promisify(this.db.get).bind(this.db)
    }

    async set(key: string, value: any) {
        return await this.db.set(key, JSON.stringify(value))
    }

    async setWithExpiry(key: string, value: any, expiry: number) {
        return await this.db.set(key, JSON.stringify(value), 'EX', expiry)
    }

    async get(key: string) {
        let ret = await this.getAsync(key);
        return JSON.parse(ret)
    }

    async pull(key: string) {
        let val = await this.get(key);
        await this.db.del(key);
        return val
    }

    getClient(): RedisClient {
        return this.db
    }
}