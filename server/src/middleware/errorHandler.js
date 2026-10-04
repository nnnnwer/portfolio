import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

// Express identifies error handlers by their four arguments, so keep `next`.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = 500;
  let message = 'Something went wrong on the server. Try again in a moment.';
  let details;

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err?.type === 'entity.parse.failed') {
    status = 400;
    message = 'The request body is not valid JSON.';
  } else if (err?.type === 'entity.too.large') {
    status = 413;
    message = 'The request body is too large.';
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, env.isProduction ? err.message : err);
  }

  res.status(status).json({
    error: {
      message,
      ...(details ? { details } : {}),
    },
  });
}
