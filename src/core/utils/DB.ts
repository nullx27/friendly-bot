import redis, {RedisClient} from "redis";
import {promisify} from "util";
import {Container} from './Container';

export class DB {
    private readonly db: redis.RedisClient;
    private container: Container;
    private readonly getAsync: Function;

    constructor(container: Container) {
        const config = container.get('config');

        this.db = redis.createClient({
            'host': config.REDIS_HOST,
            'port': config.REDIS_PORT,
            'db': config.REDIS_DATABASE,
            'password': config.REDIS_PASSWORD,
        });

        this.container = container;

        this.db.on('error', err => this.container.get('logger').error('Redis: ' + err));
        this.db.on('ready', () => this.container.get('logger').info('Redis connection established!'));

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