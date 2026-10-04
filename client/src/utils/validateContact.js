import { CONTACT_LIMITS } from '../constants/contact';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const checkLength = (label, value, { min, max }) => {
  if (min && value.length < min) return `${label} must be at least ${min} characters.`;
  if (max && value.length > max) return `${label} must be ${max} characters or fewer.`;
  return null;
};

/** Returns a map of field -> error message. Empty object means valid. */
export function validateContact(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Enter your name.';
  else if (checkLength('Name', name, CONTACT_LIMITS.name)) {
    errors.name = checkLength('Name', name, CONTACT_LIMITS.name);
  }

  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }

  if (!subject) errors.subject = 'Enter a subject.';
  else if (checkLength('Subject', subject, CONTACT_LIMITS.subject)) {
    errors.subject = checkLength('Subject', subject, CONTACT_LIMITS.subject);
  }

  if (!message) errors.message = 'Enter a message.';
  else if (checkLength('Message', message, CONTACT_LIMITS.message)) {
    errors.message = checkLength('Message', message, CONTACT_LIMITS.message);
  }

  return errors;
}
