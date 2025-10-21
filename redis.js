import Redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const RedisClient = Redis.createClient({ url: process.env.REDIS_URL });

RedisClient.on('error', (err) => console.log('Redis Client Error', err));
RedisClient.on('connect', () => console.log('Redis connected'));

await RedisClient.connect();

export { RedisClient };
