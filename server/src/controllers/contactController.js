import { saveContactMessage } from '../services/contactService.js';

const SUCCESS = { data: { message: 'Message sent. Thanks for getting in touch.' } };

export async function createContactMessage(req, res) {
  // Honeypot hit: pretend success so bots learn nothing, but store nothing.
  if (req.isSpam) return res.status(201).json(SUCCESS);

  await saveContactMessage({
    ...req.contact,
    userAgent: req.get('user-agent'),
  });

  return res.status(201).json(SUCCESS);
}
