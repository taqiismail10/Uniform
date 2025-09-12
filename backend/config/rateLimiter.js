import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Skip limiting for privileged/admin routes and when explicitly disabled
  skip: (req) => {
    try {
      if (process.env.DISABLE_RATE_LIMIT === "true") return true;
      const path = req.originalUrl || req.url || "";
      // Per-route limiters will handle API paths; skip here to avoid double limiting
      if (path.startsWith("/api")) return true;
    } catch (_) {}
    return false;
  },
});
