import redis from "express-redis-cache";

const redisCache = redis(
  process.env.REDIS_URL || "redis://localhost:6379", // One-liner!,
  {
    // host: process.env.REDISHOST || "localhost",
    // port: process.env.REDISPORT || 6379,
    prefix: "uniform",
    expire: 60 * 60, // 1 hour
  }
);

// Prevent unhandled 'error' event from crashing the process when Redis is down
try {
  if (redisCache && typeof redisCache.on === 'function') {
    let warned = false;
    redisCache.on('error', (err) => {
      if (!warned) {
        console.warn(`Redis cache error: ${err?.message || err}`);
        warned = true;
      }
    });
  }
} catch (_) {}

export default redisCache;
