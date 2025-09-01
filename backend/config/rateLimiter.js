import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Skip limiting for privileged/admin routes and when explicitly disabled
  skip: (req) => {
    try {
      if (process.env.DISABLE_RATE_LIMIT === "true") return true;
      const path = req.originalUrl || req.url || "";
      if (path.startsWith("/api/system") || path.startsWith("/api/admin")) return true;
    } catch (_) {}
    return false;
  },
});
