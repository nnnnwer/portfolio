import { api, unwrap } from './api';

/** Sends the contact form. `website` is the hidden honeypot field. */
export const sendContactMessage = ({ name, email, subject, message, website = '' }) =>
  api.post('/contact', { name, email, subject, message, website }).then(unwrap);
