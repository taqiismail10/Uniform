// backend/middleware/rateLimiters.js
import rateLimit from "express-rate-limit";

function jsonHandler(req, res /*, next, options */) {
  return res.status(429).json({
    status: 429,
    message: "Too many requests. Please slow down.",
  });
}

function ip(req) {
  return req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
}

export const studentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 600, // generous per-user browsing limit
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: jsonHandler,
  keyGenerator: (req /*, res*/) => {
    const id = req?.user?.studentId;
    return id ? `student:${id}` : `ip:${ip(req)}`;
  },
});

export const studentWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 120, // writes + heavy actions per student
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: jsonHandler,
  keyGenerator: (req) => {
    const id = req?.user?.studentId;
    return id ? `student:${id}` : `ip:${ip(req)}`;
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // max 10 attempts per email+ip
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: jsonHandler,
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toLowerCase();
    return `login:${email}:${ip(req)}`;
  },
});

export default { studentLimiter, studentWriteLimiter, loginLimiter };

