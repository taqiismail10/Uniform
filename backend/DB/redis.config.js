import redis from "express-redis-cache";

// If no REDIS_URL is provided, export a no-op cache to avoid connection errors in dev.
let redisCache;

if (process.env.REDIS_URL) {
  redisCache = redis(process.env.REDIS_URL, {
    prefix: "uniform",
    expire: 60 * 60, // 1 hour
  });

  // Prevent unhandled 'error' event from crashing the process when Redis is down
  try {
    if (redisCache && typeof redisCache.on === "function") {
      let warned = false;
      redisCache.on("error", (err) => {
        if (!warned) {
          console.warn(`Redis cache error: ${err?.message || err}`);
          warned = true;
        }
      });
    }
  } catch (_) {}
} else {
  // No-op cache implementation
  redisCache = {
    route: () => (req, res, next) => next(),
  };
}

export default redisCache;
