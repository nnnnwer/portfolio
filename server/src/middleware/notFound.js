import { HttpError } from '../utils/HttpError.js';

export function notFound(req, res, next) {
  next(new HttpError(404, `No API route matches ${req.method} ${req.originalUrl}.`));
}
