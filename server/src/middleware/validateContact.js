import { HttpError } from '../utils/HttpError.js';

export const CONTACT_LIMITS = Object.freeze({
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 5000 },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Control characters except tab (\t), newline (\n) and carriage return (\r).
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const clean = (value, { multiline = false } = {}) => {
  if (typeof value !== 'string') return '';
  let text = value.normalize('NFC').replace(CONTROL_CHARS, '');
  text = multiline ? text.replace(/\r\n/g, '\n') : text.replace(/\s+/g, ' ');
  return text.trim();
};

const lengthError = (label, { min, max }, value) => {
  if (min && value.length < min) return `${label} must be at least ${min} characters.`;
  if (max && value.length > max) return `${label} must be ${max} characters or fewer.`;
  return null;
};

/**
 * Validates and normalizes POST /api/contact bodies.
 * On success, attaches the clean values to req.contact.
 */
export function validateContact(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: real visitors never see or fill the "website" field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    req.isSpam = true;
    return next();
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const subject = clean(body.subject);
  const message = clean(body.message, { multiline: true });

  const errors = {};

  if (!name) errors.name = 'Enter your name.';
  else {
    const err = lengthError('Name', CONTACT_LIMITS.name, name);
    if (err) errors.name = err;
  }

  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }

  if (!subject) errors.subject = 'Enter a subject.';
  else {
    const err = lengthError('Subject', CONTACT_LIMITS.subject, subject);
    if (err) errors.subject = err;
  }

  if (!message) errors.message = 'Enter a message.';
  else {
    const err = lengthError('Message', CONTACT_LIMITS.message, message);
    if (err) errors.message = err;
  }

  if (Object.keys(errors).length > 0) {
    return next(new HttpError(400, 'Some fields need attention.', errors));
  }

  req.contact = { name, email, subject, message };
  return next();
}
