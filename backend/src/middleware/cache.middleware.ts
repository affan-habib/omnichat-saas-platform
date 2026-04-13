import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

export const cacheMiddleware = (ttlSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}:${(req as any).user?.tenantId || 'global'}`;

    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to capture response and cache it
      const originalJson = res.json;
      res.json = (body) => {
        redis.setex(key, ttlSeconds, JSON.stringify(body)).catch(err => console.error('Redis sets error', err));
        return originalJson.call(res, body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error', err);
      next();
    }
  };
};

export const clearCache = async (pattern: string) => {
  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(...keys);
  }
};
