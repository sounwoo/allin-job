import Redis from 'ioredis';
import { Service } from 'typedi';

@Service()
export default class RedisClient extends Redis {
    constructor() {
        super(process.env.REDIS_URL!);

        this.on('connect', () => {
            console.info('Redis 연결성공');
        });

        this.on('error', (err) => {
            console.error('Redis Client Error!!!', err.message);
        });
    }
}
