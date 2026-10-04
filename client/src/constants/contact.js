/** Mirrors server/src/middleware/validateContact.js so errors show before submitting. */
export const CONTACT_LIMITS = Object.freeze({
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 5000 },
});
