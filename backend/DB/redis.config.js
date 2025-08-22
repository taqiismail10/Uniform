import redis from "express-redis-cache";

const redisCache = redis({
  port: 6379,
  host: "localhost",
  prefix: "uniform",
  expire: 60 * 60, // 1 hour
});

export default redisCache;
