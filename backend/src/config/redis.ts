import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

export const redis = new Redis(redisConfig);
export const subRedis = new Redis(redisConfig); // Dedicated sub client for adapter

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.log('❌ Redis error:', err.message));

export default redis;
