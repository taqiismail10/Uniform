// backend/middleware/cacheBust.js
import { invalidateByPrefix } from "./cache.js";

// Registers a finish hook to invalidate user-scoped caches after write operations.
// Use on POST/PUT/PATCH/DELETE routes AFTER auth middleware.
export function bustUserCache({ scope = "/" } = {}) {
  return function onWrite(req, res, next) {
    const source = req.user || req.admin || {};
    const role = source.role || "none";
    const uid = source.studentId || source.adminId || source.systemAdminId || source.id || "anon";
    const prefix = `${role}:${uid}:${scope}`;

    res.on("finish", () => {
      try {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          invalidateByPrefix(prefix);
        }
      } catch (_) {}
    });
    next();
  };
}

export default { bustUserCache };

