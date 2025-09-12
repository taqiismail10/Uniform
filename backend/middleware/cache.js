// backend/middleware/cache.js
// Lightweight, user-scoped in-memory cache middleware for GET responses.
// Intended for authenticated routes to avoid cross-user leakage.

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || "300", 10); // 5 minutes
const MAX_ENTRIES = parseInt(process.env.CACHE_MAX_ENTRIES || "500", 10);

// Simple LRU-ish store using Map to preserve insertion order
const store = new Map(); // key -> { status, headers, body, expires }

function pruneIfNeeded() {
  if (store.size <= MAX_ENTRIES) return;
  const excess = store.size - MAX_ENTRIES;
  let i = 0;
  for (const key of store.keys()) {
    store.delete(key);
    if (++i >= excess) break;
  }
}

function buildKey(req, customKey) {
  const base = typeof customKey === "function" ? customKey(req) : (customKey || req.originalUrl || req.url);
  // Prefer stable identifiers placed by your auth middlewares
  const source = req.user || req.admin || {};
  const userId = source.studentId || source.adminId || source.systemAdminId || source.id || "anon";
  const role = source.role || "none";
  return `${role}:${userId}:${base}`;
}

export function cacheRoute(options = {}) {
  const ttl = Number.isFinite(options.ttl) ? options.ttl : DEFAULT_TTL;
  const keyFn = options.key; // optional function(req) -> string

  return function cacheMiddleware(req, res, next) {
    if (req.method !== "GET") return next();

    const key = buildKey(req, keyFn);
    const now = Date.now();
    const hit = store.get(key);
    if (hit && hit.expires > now) {
      try {
        if (hit.headers) {
          for (const [h, v] of Object.entries(hit.headers)) res.setHeader(h, v);
        }
        res.setHeader("X-Cache", "HIT");
      } catch (_) {}
      return res.status(hit.status).send(hit.body);
    }

    // Wrap res.send to capture the outgoing payload
    const origSend = res.send.bind(res);
    res.send = (body) => {
      try {
        const headers = {};
        // Persist selected headers only
        const expose = ["content-type", "cache-control"]; // lowercase keys
        for (const [h, v] of Object.entries(res.getHeaders() || {})) {
          if (expose.includes(String(h).toLowerCase())) headers[h] = v;
        }
        // Set a private cache-control for clients as well (optional)
        if (!res.getHeader("Cache-Control")) {
          res.setHeader("Cache-Control", `private, max-age=${Math.max(0, Math.floor(ttl))}`);
          headers["Cache-Control"] = res.getHeader("Cache-Control");
        }
        store.set(key, {
          status: res.statusCode || 200,
          headers,
          body,
          expires: Date.now() + ttl * 1000,
        });
        pruneIfNeeded();
        res.setHeader("X-Cache", "MISS");
      } catch (_) {}
      return origSend(body);
    };

    next();
  };
}

export function invalidateByPrefix(prefix) {
  const pref = String(prefix);
  for (const key of Array.from(store.keys())) {
    if (key.includes(pref)) store.delete(key);
  }
}

export function clearCache() {
  store.clear();
}

export default { cacheRoute, invalidateByPrefix, clearCache };
