import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';

const rateLimitResponse = (message) => (req, res, next, options) => {
  res.status(options.statusCode).json({ error: { message } });
};

/** Generous limit for all API reads. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitResponse('Too many requests from this network. Wait a few minutes and try again.'),
});

/** Strict limit for the contact form to slow down spam. */
export const contactLimiter = rateLimit({
  windowMs: env.contactRateLimitWindowMs,
  limit: env.contactRateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitResponse(
    `You've sent several messages recently. Wait ${Math.round(
      env.contactRateLimitWindowMs / 60000,
    )} minutes before sending another.`,
  ),
});
