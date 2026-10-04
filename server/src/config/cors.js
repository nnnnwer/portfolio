import { env } from './env.js';

const allowed = new Set(env.clientOrigins);

export const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header (curl, health checks, server-to-server)
    // are not subject to browser CORS rules, so let them through.
    if (!origin) return callback(null, true);
    // Unknown origins get no CORS headers; the browser then blocks the response.
    return callback(null, allowed.has(origin));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400,
};
