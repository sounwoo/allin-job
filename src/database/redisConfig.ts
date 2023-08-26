import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on('connect', () => console.info('Redis 연결성공'));
redisClient.on('error', (err) =>
    console.error('Redis Client Error!!!', err.message),
);

export default redisClient;
