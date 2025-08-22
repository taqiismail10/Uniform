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

export default redisCache;
